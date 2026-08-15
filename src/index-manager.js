import { readdirSync } from 'fs';
import path from 'path';
import { PLAYERS_DIR, TOURNAMENTS_DIR, INDEX_DIR, readJSON, writeJSON } from './utils.js';

import { copyFileSync, mkdirSync, existsSync, statSync } from 'fs';

function syncToDocs(src = PLAYERS_DIR ? path.dirname(PLAYERS_DIR) : 'league-data', dest = 'docs/league-data') {
  try {
    const copyDir = (s, d) => {
      mkdirSync(d, { recursive: true });
      for (const entry of readdirSync(s)) {
        const srcPath = path.join(s, entry);
        const destPath = path.join(d, entry);
        if (statSync(srcPath).isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    };
    copyDir(src, dest);
  } catch (e) {
    // ignore sync errors if docs folder doesn't exist
  }
}

/**
 * Regenerate players_index.json from all player files.
 * The index maps player_id -> { display_name, known_aliases }
 * This is a full rebuild (not append), since it's a cache.
 */
export function regeneratePlayersIndex() {
  const index = {};
  try {
    const files = readdirSync(PLAYERS_DIR);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(PLAYERS_DIR, file);
      const playerData = readJSON(filePath);
      
      if (playerData && playerData.player_id) {
        index[playerData.player_id] = {
          display_name: playerData.display_name,
          known_aliases: playerData.known_aliases || []
        };
      }
    }
    
    writeJSON(path.join(INDEX_DIR, 'players_index.json'), index);
    syncToDocs();
    return true;
  } catch (error) {
    console.error('Error regenerating players index:', error);
    return false;
  }
}

/**
 * Regenerate tournaments_index.json from all tournament files.
 * The index maps tournament_id -> { date, opponent_league, status, result }
 * Full rebuild each time.
 */
export function regenerateTournamentsIndex() {
  const index = {};
  try {
    const files = readdirSync(TOURNAMENTS_DIR);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(TOURNAMENTS_DIR, file);
      const tournamentData = readJSON(filePath);
      
      if (tournamentData && tournamentData.tournament_id) {
        index[tournamentData.tournament_id] = {
          date: tournamentData.date,
          opponent_league: tournamentData.opponent_league,
          status: tournamentData.status,
          result: tournamentData.result
        };
      }
    }
    
    writeJSON(path.join(INDEX_DIR, 'tournaments_index.json'), index);
    syncToDocs();
    return true;
  } catch (error) {
    console.error('Error regenerating tournaments index:', error);
    return false;
  }
}

import fs from 'fs';
import path from 'path';
import { PLAYERS_DIR, readJSON, writeJSON, TOURNAMENTS_DIR } from './src/utils.js';
import { createTournament, saveTournament } from './src/tournament-manager.js';
import { findPlayerByName, createPlayer, savePlayer, updateEligibility, loadPlayer } from './src/player-manager.js';
import { regeneratePlayersIndex, regenerateTournamentsIndex } from './src/index-manager.js';

// 1. CLEANUP OLD DATA
const players = fs.readdirSync(PLAYERS_DIR).filter(f => f.endsWith('.json'));
for (const p of players) {
  const pPath = path.join(PLAYERS_DIR, p);
  const data = readJSON(pPath);
  let changed = false;
  
  if (data.matches) {
    data.matches = data.matches.filter(m => m.tournament_id !== '2026-08-09_abtal-al-arab');
    changed = true;
  }
  if (data.eligibility_streak && data.eligibility_streak.history) {
    data.eligibility_streak.history = data.eligibility_streak.history.filter(h => h.tournament_id !== '2026-08-09_abtal-al-arab');
  }
  
  if (changed) {
    // Recompute fails
    let fails = 0;
    for (const m of data.matches) {
      if (m.turns_played < 3) fails++;
    }
    data.eligibility_streak.fails = fails;
    
    // Recompute average
    let totalGoals = 0;
    for (const m of data.matches) {
      totalGoals += (m.goals_for || 0);
    }
    data.average_goals = data.matches.length > 0 ? (totalGoals / data.matches.length) : 0;
    
    writeJSON(pPath, data);
  }
}

// Delete old tournament
const tPath = path.join(TOURNAMENTS_DIR, '2026-08-09_abtal-al-arab.json');
if (fs.existsSync(tPath)) {
    fs.unlinkSync(tPath);
}

// 2. INGEST NEW DATA
const dateStr = '2026-08-09';
const opponent = 'ابطال العرب';
const tournamentId = `2026-08-09_abtal-al-arab`;
  
const matchesData = [
  { name: 'саня', goals: 31, turnsRemaining: 0 },
  { name: 'Mohamed_Osama', goals: 14, turnsRemaining: 0 },
  { name: 'Paris.Amjd', goals: 0, turnsRemaining: 3 },
  { name: 'kata', goals: 0, turnsRemaining: 3 },
  { name: 'Stanlox', goals: 30, turnsRemaining: 0 },
  { name: 'kabeludo', goals: 27, turnsRemaining: 0 },
  { name: 'GOD_SRW', goals: 0, turnsRemaining: 3 },
  { name: 'MESSI', goals: 0, turnsRemaining: 3 },
  { name: 'ASM', goals: 32, turnsRemaining: 0 },
  { name: 'Kaklq', goals: 22, turnsRemaining: 0 },
  { name: 'K8N', goals: 28, turnsRemaining: 0 },
  { name: 'Igor', goals: 34, turnsRemaining: 0 },
  { name: 'Mayorz.225', goals: 27, turnsRemaining: 0 },
  { name: 'Adidas257', goals: 30, turnsRemaining: 0 },
  { name: 'RMa_jXAHB', goals: 31, turnsRemaining: 0 },
  { name: 'aneek', goals: 31, turnsRemaining: 0 },
  { name: 'CR7Siiii', goals: 0, turnsRemaining: 3 },
  { name: 'thuner', goals: 34, turnsRemaining: 0 },
  { name: 'LegendRutu18', goals: 15, turnsRemaining: 0 },
  { name: 'Mithaaj', goals: 28, turnsRemaining: 0 },
  { name: 'z5414b05.28', goals: 0, turnsRemaining: 3 },
  { name: '11Am', goals: 0, turnsRemaining: 0 },
  { name: 'PITER', goals: 0, turnsRemaining: 3 },
  { name: 'DOXIBÉRO', goals: 27, turnsRemaining: 0 },
  { name: 'm.rifki', goals: 0, turnsRemaining: 3 },
  { name: '4022г4', goals: 24, turnsRemaining: 0 },
  { name: 'Venusviper', goals: 10, turnsRemaining: 1 },
  { name: 'EBUBEOKORIE', goals: 0, turnsRemaining: 3 },
  { name: 'PIAN77', goals: 0, turnsRemaining: 3 },
  { name: 'Mad_Ruma_555', goals: 0, turnsRemaining: 3 },
  { name: 'rizamat', goals: 0, turnsRemaining: 3 },
  { name: 'DOXIBERO1', goals: 24, turnsRemaining: 0 }
];

let tournamentMatches = [];

for (let i = 0; i < matchesData.length; i++) {
  const data = matchesData[i];
  const turnsPlayed = 3 - data.turnsRemaining;
  
  let search = findPlayerByName(data.name);
  let playerId = search.playerId;
  
  if (search.match === 'none' || !playerId) {
    const newP = createPlayer(data.name);
    playerId = newP.player_id;
  }

  const matchObj = {
    tournament_id: tournamentId,
    match_index_in_tournament: i + 1,
    opponent_display_name: opponent,
    opponent_id: 'abtal-al-arab',
    goals_for: data.goals,
    goals_against: 0,
    result: data.goals > 0 ? 'win' : (turnsPlayed > 0 ? 'loss' : 'draw'),
    turns_played: turnsPlayed,
    player_display_name: data.name,
    player_id: playerId
  };

  let player = loadPlayer(playerId);
  if (!player.matches) player.matches = [];
  player.matches.push(matchObj);
  savePlayer(player);

  updateEligibility(playerId, tournamentId, turnsPlayed, data.goals);

  tournamentMatches.push(matchObj);
}

createTournament(tournamentId, dateStr, opponent, '32v32');
const tData = {
  tournament_id: tournamentId,
  opponent_total_goals: 566,
  our_total_goals: 499,
  matches: tournamentMatches,
  status: 'complete',
  result: 'loss'
};
saveTournament(tData);

regeneratePlayersIndex();
regenerateTournamentsIndex();
console.log('Fixed Abtal Al Arab!');

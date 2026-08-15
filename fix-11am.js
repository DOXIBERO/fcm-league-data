import { loadPlayer, savePlayer, updateEligibility } from './src/player-manager.js';
import { readJSON, writeJSON, TOURNAMENTS_DIR } from './src/utils.js';
import path from 'path';

// Fix 11Am in player file
const player = loadPlayer('11am');
if (player && player.matches) {
    for (const m of player.matches) {
        if (m.tournament_id === '2026-08-09_abtal-al-arab') {
            m.turns_played = 0;
            m.result = 'loss';
        }
    }
    savePlayer(player);
    updateEligibility('11am');
}

// Fix 11Am in tournament file
const tPath = path.join(TOURNAMENTS_DIR, '2026-08-09_abtal-al-arab.json');
const tData = readJSON(tPath);
if (tData && tData.matches) {
    for (const m of tData.matches) {
        if (m.player_id === '11am') {
            m.turns_played = 0;
            m.result = 'loss';
        }
    }
    writeJSON(tPath, tData);
}
console.log('Fixed 11Am!');

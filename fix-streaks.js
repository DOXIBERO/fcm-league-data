import { loadAllPlayers, updateEligibility } from './src/player-manager.js';
import { regeneratePlayersIndex } from './src/index-manager.js';

const players = loadAllPlayers();
for (const p of players) {
    updateEligibility(p.player_id);
}
regeneratePlayersIndex();
console.log('Streaks fixed');

import { loadPlayer, savePlayer, updateEligibility } from './src/player-manager.js';
import { readJSON, writeJSON, TOURNAMENTS_DIR, PLAYERS_DIR } from './src/utils.js';
import fs from 'fs';
import path from 'path';

// Fix Arabs Team (was 13, move to 12)
// Fix Free Palestine (was 14, move to 13)
const renames = [
  { oldId: '2026-08-13_arabs-team', newId: '2026-08-12_arabs-team' },
  { oldId: '2026-08-14_free-palestine', newId: '2026-08-13_free-palestine' }
];

for (const { oldId, newId } of renames) {
  const oldPath = path.join(TOURNAMENTS_DIR, `${oldId}.json`);
  if (fs.existsSync(oldPath)) {
    const tData = readJSON(oldPath);
    tData.tournament_id = newId;
    // update all match objects in the tournament file
    for (const m of tData.matches) {
      m.tournament_id = newId;
    }
    writeJSON(path.join(TOURNAMENTS_DIR, `${newId}.json`), tData);
    fs.unlinkSync(oldPath);
  }
}

// Update player files
const playerFiles = fs.readdirSync(PLAYERS_DIR).filter(f => f.endsWith('.json'));
for (const file of playerFiles) {
  const pPath = path.join(PLAYERS_DIR, file);
  const pData = readJSON(pPath);
  let changed = false;
  
  if (pData.matches) {
    for (const m of pData.matches) {
      const matchRename = renames.find(r => r.oldId === m.tournament_id);
      if (matchRename) {
        m.tournament_id = matchRename.newId;
        changed = true;
      }
    }
  }

  if (changed) {
    writeJSON(pPath, pData);
    updateEligibility(pData.player_id);
  }
}
console.log('Fixed dates!');

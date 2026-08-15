import { readJSON, writeJSON, TOURNAMENTS_DIR } from './src/utils.js';
import { regenerateTournamentsIndex } from './src/index-manager.js';
import fs from 'fs';
import path from 'path';

// Fix date properties in the files
const fixes = [
  { id: '2026-08-12_arabs-team', date: '2026-08-12' },
  { id: '2026-08-13_free-palestine', date: '2026-08-13' }
];

for (const { id, date } of fixes) {
  const tPath = path.join(TOURNAMENTS_DIR, `${id}.json`);
  if (fs.existsSync(tPath)) {
    const tData = readJSON(tPath);
    tData.date = date;
    writeJSON(tPath, tData);
  }
}

regenerateTournamentsIndex();

// Clean up stale files in docs/league-data/tournaments
const docsTournamentsDir = 'docs/league-data/tournaments';
if (fs.existsSync(docsTournamentsDir)) {
  const docsFiles = fs.readdirSync(docsTournamentsDir);
  for (const file of docsFiles) {
    if (file === '2026-08-13_arabs-team.json' || file === '2026-08-14_free-palestine.json') {
      fs.unlinkSync(path.join(docsTournamentsDir, file));
    }
  }
}

console.log('Fixed date properties and cleaned stale files!');

import { regeneratePlayersIndex, regenerateTournamentsIndex } from './src/index-manager.js';

regeneratePlayersIndex();
regenerateTournamentsIndex();
console.log('Indexes rebuilt and synced to docs');

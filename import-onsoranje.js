import { createTournament, saveTournament } from './src/tournament-manager.js';
import { findPlayerByName, createPlayer, savePlayer, updateEligibility } from './src/player-manager.js';
import { regeneratePlayersIndex, regenerateTournamentsIndex } from './src/index-manager.js';

async function ingest() {
  const dateStr = '2026-08-11';
  const opponent = 'OnsOranje®';
  const tournamentId = `2026-08-11_onsoranje`;
  
  const matchesData = [
    { name: 'саня', goals: 36, turnsRemaining: 0 },
    { name: 'MaxVerstepen', goals: 34, turnsRemaining: 0 },
    { name: 'Mohamed_Osama', goals: 0, turnsRemaining: 3 },
    { name: 'Paris.Amjd', goals: 0, turnsRemaining: 3 },
    { name: 'Stanlox', goals: 30, turnsRemaining: 0 },
    { name: 'GOD_SRW', goals: 0, turnsRemaining: 3 },
    { name: 'акмал', goals: 0, turnsRemaining: 3 },
    { name: 'R.ØÇAŇ¡TĄȘ', goals: 27, turnsRemaining: 0 },
    { name: 'MESSI', goals: 0, turnsRemaining: 3 },
    { name: 'ASM', goals: 20, turnsRemaining: 0 },
    { name: 'QARABAĞ', goals: 0, turnsRemaining: 3 },
    { name: 'K8N', goals: 31, turnsRemaining: 0 },
    { name: 'Igor', goals: 33, turnsRemaining: 0 },
    { name: 'Monchinho', goals: 0, turnsRemaining: 3 },
    { name: 'MADRIDISTASFC', goals: 0, turnsRemaining: 3 },
    { name: 'MOHAMEDHAMDEN123', goals: 0, turnsRemaining: 3 },
    { name: 'kata', goals: 0, turnsRemaining: 3 },
    { name: 'Adidas257', goals: 31, turnsRemaining: 0 },
    { name: 'RMa_jXAHB', goals: 34, turnsRemaining: 0 },
    { name: 'riztian', goals: 0, turnsRemaining: 3 },
    { name: 'aneek', goals: 31, turnsRemaining: 0 },
    { name: 'thuner', goals: 0, turnsRemaining: 3 },
    { name: 'LegendRutu18', goals: 18, turnsRemaining: 0 },
    { name: 'Mithaaj', goals: 27, turnsRemaining: 0 },
    { name: 'PITER', goals: 0, turnsRemaining: 3 },
    { name: 'DOXIBÉRO', goals: 32, turnsRemaining: 0 },
    { name: 'MATADOR-ICON', goals: 0, turnsRemaining: 3 },
    { name: 'Venusviper', goals: 0, turnsRemaining: 3 },
    { name: 'EBUBEOKORIE', goals: 0, turnsRemaining: 3 },
    { name: 'bloodwolf', goals: 27, turnsRemaining: 0 },
    { name: 'PIAN77', goals: 0, turnsRemaining: 3 },
    { name: 'DOXIBERO1', goals: 24, turnsRemaining: 0 }
  ];

  let tournamentMatches = [];

  for (let i = 0; i < matchesData.length; i++) {
    const data = matchesData[i];
    const turnsPlayed = 3 - data.turnsRemaining;
    
    // Find or create player
    let search = findPlayerByName(data.name);
    let playerId = search.playerId;
    
    if (search.match === 'none' || !playerId) {
      console.log(`Creating new player: ${data.name}`);
      const newP = createPlayer(data.name);
      playerId = newP.player_id;
    }

    const matchObj = {
      tournament_id: tournamentId,
      match_index_in_tournament: i,
      opponent_display_name: opponent,
      opponent_id: 'onsoranje',
      goals_for: data.goals,
      goals_against: 0,
      result: data.goals > 0 ? 'win' : (turnsPlayed > 0 ? 'loss' : 'draw'), // placeholder logic for individual result
      turns_played: turnsPlayed,
      player_display_name: data.name,
      player_id: playerId
    };

    // Save to player file
    savePlayer({
      player_id: playerId,
      matches: [matchObj]
    });

    // Update eligibility
    updateEligibility(playerId, tournamentId, turnsPlayed, data.goals);

    tournamentMatches.push(matchObj);
  }

  // Create & save tournament
  createTournament(tournamentId, dateStr, opponent, '32v32');
  
  const tData = {
    tournament_id: tournamentId,
    matches: tournamentMatches,
    status: 'complete' // Assuming it's complete
  };
  
  saveTournament(tData);

  console.log('Rebuilding indexes...');
  regeneratePlayersIndex();
  regenerateTournamentsIndex();
  console.log('Done!');
}

ingest().catch(console.error);

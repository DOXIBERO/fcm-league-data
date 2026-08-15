import { createTournament, saveTournament } from './src/tournament-manager.js';
import { findPlayerByName, createPlayer, savePlayer, updateEligibility } from './src/player-manager.js';
import { regeneratePlayersIndex, regenerateTournamentsIndex } from './src/index-manager.js';

async function ingest() {
  const dateStr = '2026-08-12';
  const opponent = 'Warga +82™';
  const tournamentId = `2026-08-12_warga`;
  
  const matchesData = [
    { name: 'саня', goals: 36, turnsRemaining: 0 },
    { name: 'MaxVerstepen', goals: 34, turnsRemaining: 0 },
    { name: 'thuner', goals: 0, turnsRemaining: 3 },
    { name: 'CR7Siiii', goals: 0, turnsRemaining: 3 },
    { name: 'riztian', goals: 0, turnsRemaining: 3 },
    { name: 'RMa_jXAHB', goals: 0, turnsRemaining: 3 },
    { name: 'Venusviper', goals: 32, turnsRemaining: 0 },
    { name: 'K8N', goals: 28, turnsRemaining: 0 }
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
      opponent_id: 'warga_82',
      goals_for: data.goals,
      goals_against: 0,
      result: data.goals > 0 ? 'win' : (turnsPlayed > 0 ? 'loss' : 'draw'), // placeholder
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
  createTournament(tournamentId, dateStr, opponent, '8v8');
  
  const tData = {
    tournament_id: tournamentId,
    matches: tournamentMatches,
    our_total_goals: 130,
    opponent_total_goals: 225,
    status: 'complete'
  };
  
  saveTournament(tData);

  console.log('Rebuilding indexes...');
  regeneratePlayersIndex();
  regenerateTournamentsIndex();
  console.log('Done!');
}

ingest().catch(console.error);

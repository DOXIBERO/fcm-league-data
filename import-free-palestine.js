import { createTournament, saveTournament } from './src/tournament-manager.js';
import { findPlayerByName, createPlayer, savePlayer, updateEligibility, loadPlayer } from './src/player-manager.js';
import { regeneratePlayersIndex, regenerateTournamentsIndex } from './src/index-manager.js';

const dateStr = '2026-08-14';
const opponent = 'FREE PALESTINE';
const tournamentId = `2026-08-14_free-palestine`;

const matchesData = [
  { name: 'саня', goals: 37, turnsRemaining: 0 },
  { name: 'Stanlox', goals: 29, turnsRemaining: 0 },
  { name: 'aneek', goals: 37, turnsRemaining: 0 },
  { name: 'RMa_jXAHB', goals: 30, turnsRemaining: 0 },
  { name: 'Igor', goals: 0, turnsRemaining: 3 },
  { name: 'ASM', goals: 31, turnsRemaining: 0 },
  { name: 'R.ØÇąÑįTąS', goals: 0, turnsRemaining: 3 },
  { name: 'GOD_SRW', goals: 0, turnsRemaining: 3 },
  { name: 'Mohamed_Osama', goals: 28, turnsRemaining: 0 },
  { name: 'DOXIBÉRO', goals: 34, turnsRemaining: 0 },
  { name: 'Mithaaj', goals: 0, turnsRemaining: 3 },
  { name: 'LegendRutu18', goals: 0, turnsRemaining: 0 },
  { name: 'EBUBEOKORIE', goals: 0, turnsRemaining: 0 },
  { name: 'bloodwolf', goals: 30, turnsRemaining: 0 },
  { name: 'PIAN77', goals: 0, turnsRemaining: 0 },
  { name: 'DOXIBERO1', goals: 43, turnsRemaining: 0 }
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
    opponent_id: 'free-palestine',
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

  updateEligibility(playerId);

  tournamentMatches.push(matchObj);
}

createTournament(tournamentId, dateStr, opponent, '16v16');
const tData = {
  tournament_id: tournamentId,
  opponent_total_goals: 416,
  our_total_goals: 299,
  matches: tournamentMatches,
  status: 'complete',
  result: 'loss'
};
saveTournament(tData);

regeneratePlayersIndex();
regenerateTournamentsIndex();
console.log('Ingested FREE PALESTINE!');

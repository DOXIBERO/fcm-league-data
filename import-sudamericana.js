import { createTournament, saveTournament } from './src/tournament-manager.js';
import { findPlayerByName, createPlayer, savePlayer, updateEligibility, loadPlayer } from './src/player-manager.js';
import { regeneratePlayersIndex, regenerateTournamentsIndex } from './src/index-manager.js';

const dateStr = '2026-08-14';
const opponent = 'SUDAMERICANA';
const tournamentId = `2026-08-14_sudamericana`;

const matchesData = [
  { name: 'саня', goals: 37, turnsRemaining: 0 },
  { name: 'MaxVerstepen', goals: 0, turnsRemaining: 3 },
  { name: 'Igor', goals: 27, turnsRemaining: 0 },
  { name: 'Mohamed_Osama', goals: 22, turnsRemaining: 0 },
  { name: 'GOD_SRW', goals: 0, turnsRemaining: 3 },
  { name: 'midhunn', goals: 0, turnsRemaining: 3 },
  { name: 'R.ØÇąÑįTąS', goals: 28, turnsRemaining: 0 },
  { name: 'MESSI', goals: 0, turnsRemaining: 3 },
  { name: 'Randi', goals: 0, turnsRemaining: 3 },
  { name: 'ASM', goals: 0, turnsRemaining: 3 },
  { name: 'Kaklq', goals: 0, turnsRemaining: 3 },
  { name: 'Paris.Amjd', goals: 0, turnsRemaining: 3 },
  { name: 'K8N', goals: 38, turnsRemaining: 0 },
  { name: 'Stanlox', goals: 30, turnsRemaining: 0 },
  { name: 'ţħuner', goals: 0, turnsRemaining: 3 },
  { name: 'aneek', goals: 10, turnsRemaining: 2 }, // 2/3 limit -> 1 turn played
  { name: 'RMa_jXAHB', goals: 29, turnsRemaining: 0 },
  { name: 'Venusviper', goals: 32, turnsRemaining: 0 },
  { name: 'Adidas257', goals: 0, turnsRemaining: 3 },
  { name: 'kata', goals: 0, turnsRemaining: 3 },
  { name: 'MOHAMEDHAMDEN123', goals: 0, turnsRemaining: 3 },
  { name: 'Mayorz.225', goals: 34, turnsRemaining: 0 },
  { name: 'Abubakr', goals: 30, turnsRemaining: 0 },
  { name: 'MADRIDISTASFC', goals: 0, turnsRemaining: 3 },
  { name: 'siuuu', goals: 0, turnsRemaining: 3 },
  { name: 'WHITEREX', goals: 34, turnsRemaining: 0 },
  { name: 'kratos', goals: 0, turnsRemaining: 3 },
  { name: 'PITER', goals: 0, turnsRemaining: 3 },
  { name: 'DOXIBÉRO', goals: 42, turnsRemaining: 0 },
  { name: 'Mithaaj', goals: 28, turnsRemaining: 0 },
  { name: 'bloodwolf', goals: 26, turnsRemaining: 0 },
  { name: 'DOXIBERO1', goals: 25, turnsRemaining: 0 }
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
    opponent_id: 'sudamericana',
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

createTournament(tournamentId, dateStr, opponent, '32v32');
const tData = {
  tournament_id: tournamentId,
  opponent_total_goals: 376,
  our_total_goals: 472,
  matches: tournamentMatches,
  status: 'complete',
  result: 'win'
};
saveTournament(tData);

regeneratePlayersIndex();
regenerateTournamentsIndex();
console.log('Ingested SUDAMERICANA!');

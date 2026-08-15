/**
 * Stats Engine — §8 of the spec.
 * All stats are computed live from committed player/tournament files.
 * Nothing here is stored as source of truth — it's all derived views.
 */

import { readdirSync } from 'fs';
import path from 'path';
import { PLAYERS_DIR, TOURNAMENTS_DIR, readJSON } from './utils.js';
import { loadAllPlayers } from './player-manager.js';
import { loadAllTournaments } from './tournament-manager.js';

/**
 * Per-player all-time stats (§8.3).
 * Only includes matches actually played — absences are invisible.
 */
export function playerAllTimeStats(playerId) {
  const player = readJSON(path.join(PLAYERS_DIR, `${playerId}.json`));
  if (!player || !player.matches.length) return null;

  const matches = player.matches;
  const totalMatches = matches.length;
  const goalsFor = matches.reduce((s, m) => s + m.goals_for, 0);
  const goalsAgainst = matches.reduce((s, m) => s + m.goals_against, 0);
  const wins = matches.filter(m => m.result === 'win').length;
  const draws = matches.filter(m => m.result === 'draw').length;
  const losses = matches.filter(m => m.result === 'loss').length;

  return {
    player_id: playerId,
    display_name: player.display_name,
    total_matches: totalMatches,
    goals_for: goalsFor,
    goals_against: goalsAgainst,
    goal_difference: goalsFor - goalsAgainst,
    wins,
    draws,
    losses,
    win_rate: totalMatches > 0 ? +(wins / totalMatches * 100).toFixed(1) : 0,
    avg_goals_per_match: totalMatches > 0 ? +(goalsFor / totalMatches).toFixed(2) : 0,
    flagged_for_review: player.eligibility_streak?.flagged_for_review || false,
    current_fail_streak: player.eligibility_streak?.current_fail_streak || 0,
  };
}

/**
 * Per-player rolling window stats (§8.3).
 * "Weekly" = rolling 7 days, "Monthly" = rolling 30 days from the most recent tournament date.
 * A player who didn't play in the window doesn't appear — no zeros.
 * 
 * @param {string} playerId
 * @param {number} windowDays - 7 for weekly, 30 for monthly, etc.
 * @param {string} [referenceDate] - ISO date string; defaults to today
 */
export function playerWindowStats(playerId, windowDays, referenceDate = null) {
  const player = readJSON(path.join(PLAYERS_DIR, `${playerId}.json`));
  if (!player || !player.matches.length) return null;

  const ref = referenceDate ? new Date(referenceDate) : new Date();
  const cutoff = new Date(ref);
  cutoff.setDate(cutoff.getDate() - windowDays);

  // We need tournament dates — load tournament index or files to map tournament_id -> date
  const tournamentsIndex = readJSON(path.join(TOURNAMENTS_DIR, '..', 'index', 'tournaments_index.json')) || {};

  const filteredMatches = player.matches.filter(m => {
    const tInfo = tournamentsIndex[m.tournament_id];
    if (!tInfo) return false;
    const tDate = new Date(tInfo.date);
    return tDate >= cutoff && tDate <= ref;
  });

  if (filteredMatches.length === 0) return null; // Player didn't play in this window

  const totalMatches = filteredMatches.length;
  const goalsFor = filteredMatches.reduce((s, m) => s + m.goals_for, 0);
  const goalsAgainst = filteredMatches.reduce((s, m) => s + m.goals_against, 0);
  const wins = filteredMatches.filter(m => m.result === 'win').length;
  const draws = filteredMatches.filter(m => m.result === 'draw').length;
  const losses = filteredMatches.filter(m => m.result === 'loss').length;

  return {
    player_id: playerId,
    display_name: player.display_name,
    window_days: windowDays,
    window_start: cutoff.toISOString().split('T')[0],
    window_end: ref.toISOString().split('T')[0],
    total_matches: totalMatches,
    goals_for: goalsFor,
    goals_against: goalsAgainst,
    goal_difference: goalsFor - goalsAgainst,
    wins,
    draws,
    losses,
    win_rate: totalMatches > 0 ? +(wins / totalMatches * 100).toFixed(1) : 0,
    avg_goals_per_match: totalMatches > 0 ? +(goalsFor / totalMatches).toFixed(2) : 0,
  };
}

/**
 * Per-tournament summary for a specific player (§8.2).
 */
export function playerTournamentStats(playerId, tournamentId) {
  const player = readJSON(path.join(PLAYERS_DIR, `${playerId}.json`));
  if (!player) return null;

  const matches = player.matches.filter(m => m.tournament_id === tournamentId);
  if (matches.length === 0) return null; // Didn't participate — invisible

  return {
    player_id: playerId,
    display_name: player.display_name,
    tournament_id: tournamentId,
    matches_played: matches.length,
    goals_for_total: matches.reduce((s, m) => s + m.goals_for, 0),
    goals_against_total: matches.reduce((s, m) => s + m.goals_against, 0),
    wins: matches.filter(m => m.result === 'win').length,
    draws: matches.filter(m => m.result === 'draw').length,
    losses: matches.filter(m => m.result === 'loss').length,
  };
}

/**
 * Full tournament summary (§8.4) with per-player breakdown.
 */
export function tournamentSummary(tournamentId) {
  const tournament = readJSON(path.join(TOURNAMENTS_DIR, `${tournamentId}.json`));
  if (!tournament) return null;

  // Build per-player breakdown from tournament matches
  const playerMap = {};
  for (const match of tournament.matches) {
    const pid = match.player_id || match.source_screenshot; // fallback key
    if (!playerMap[pid]) {
      playerMap[pid] = {
        player_id: pid,
        display_name: match.player_display_name || pid,
        matches: [],
      };
    }
    playerMap[pid].matches.push(match);
  }

  const playerBreakdowns = Object.values(playerMap).map(p => ({
    player_id: p.player_id,
    display_name: p.display_name,
    matches_played: p.matches.length,
    goals_for: p.matches.reduce((s, m) => s + m.goals_for, 0),
    goals_against: p.matches.reduce((s, m) => s + m.goals_against, 0),
    wins: p.matches.filter(m => m.result === 'win').length,
    draws: p.matches.filter(m => m.result === 'draw').length,
    losses: p.matches.filter(m => m.result === 'loss').length,
  }));

  // Sort by goals_for descending
  playerBreakdowns.sort((a, b) => b.goals_for - a.goals_for);

  return {
    tournament_id: tournament.tournament_id,
    date: tournament.date,
    opponent_league: tournament.opponent_league,
    format: tournament.format,
    status: tournament.status,
    our_total_goals: tournament.our_total_goals,
    opponent_total_goals: tournament.opponent_total_goals,
    result: tournament.result,
    player_count: playerBreakdowns.length,
    player_breakdowns: playerBreakdowns,
  };
}

/**
 * League all-time record (§8.4).
 * Tournaments won/lost, total goal difference.
 */
export function leagueRecord() {
  const tournaments = loadAllTournaments();
  const completed = tournaments.filter(t => t.status === 'complete');

  const totalWins = completed.filter(t => t.result === 'win').length;
  const totalLosses = completed.filter(t => t.result === 'loss').length;
  const totalDraws = completed.filter(t => t.result === 'draw').length;
  const totalGoalsFor = tournaments.reduce((s, t) => s + (t.our_total_goals || 0), 0);
  const totalGoalsAgainst = tournaments.reduce((s, t) => s + (t.opponent_total_goals || 0), 0);

  return {
    total_tournaments: tournaments.length,
    completed_tournaments: completed.length,
    wins: totalWins,
    draws: totalDraws,
    losses: totalLosses,
    win_rate: completed.length > 0 ? +(totalWins / completed.length * 100).toFixed(1) : 0,
    total_goals_for: totalGoalsFor,
    total_goals_against: totalGoalsAgainst,
    goal_difference: totalGoalsFor - totalGoalsAgainst,
  };
}

/**
 * Get all flagged players (§9.4).
 */
export function flaggedPlayers() {
  const players = loadAllPlayers();
  return players
    .filter(p => p.eligibility_streak?.flagged_for_review === true)
    .map(p => ({
      player_id: p.player_id,
      display_name: p.display_name,
      current_fail_streak: p.eligibility_streak.current_fail_streak,
      last_evaluated_tournament_id: p.eligibility_streak.last_evaluated_tournament_id,
    }));
}

/**
 * Get all player stats for a leaderboard view.
 * Sorted by total goals descending.
 * @param {number} [windowDays] - if provided, filter to this rolling window
 */
export function leaderboard(windowDays = null) {
  const players = loadAllPlayers();
  const stats = [];

  for (const player of players) {
    let s;
    if (windowDays) {
      s = playerWindowStats(player.player_id, windowDays);
    } else {
      s = playerAllTimeStats(player.player_id);
    }
    if (s) stats.push(s);
  }

  // Sort by goals_for descending, then by win_rate
  stats.sort((a, b) => b.goals_for - a.goals_for || b.win_rate - a.win_rate);
  return stats;
}

/**
 * Format stats as a readable table string for chat output.
 * @param {Array} statsArray - array of player stat objects
 * @param {string} title - table title
 * @returns {string} Markdown table
 */
export function formatStatsTable(statsArray, title = 'Player Stats') {
  if (!statsArray || statsArray.length === 0) return `**${title}**\n\nNo data available.`;

  const header = `| # | Player | Matches | GF | GA | GD | W | D | L | Win% | Avg GF |`;
  const separator = `|---|--------|---------|----|----|----|----|---|---|------|--------|`;

  const rows = statsArray.map((s, i) => {
    const flag = s.flagged_for_review ? ' ⚠️' : '';
    return `| ${i + 1} | ${s.display_name}${flag} | ${s.total_matches} | ${s.goals_for} | ${s.goals_against} | ${s.goal_difference} | ${s.wins} | ${s.draws} | ${s.losses} | ${s.win_rate}% | ${s.avg_goals_per_match} |`;
  });

  return `**${title}**\n\n${header}\n${separator}\n${rows.join('\n')}`;
}

import { readdirSync } from 'fs';
import path from 'path';
import { TOURNAMENTS_DIR, readJSON, writeJSON, slugify, nowISO } from './utils.js';

/**
 * Load a tournament by tournament_id. Returns null if not found.
 */
export function loadTournament(tournamentId) {
    const filePath = path.join(TOURNAMENTS_DIR, `${tournamentId}.json`);
    return readJSON(filePath);
}

/**
 * Save tournament data. ADDITIVE merge:
 * - Load existing tournament file if it exists
 * - Merge new matches into the matches array (dedup by player's player_id + match_index_in_tournament, or player_id + opponent + scoreline if no index)
 * - Recompute our_total_goals, opponent_total_goals, and result from all matches
 * - Write back
 */
export function saveTournament(tournamentData) {
    const filePath = path.join(TOURNAMENTS_DIR, `${tournamentData.tournament_id}.json`);
    let existingData = readJSON(filePath);
    
    if (!existingData) {
        existingData = {
            tournament_id: tournamentData.tournament_id,
            date: tournamentData.date,
            opponent_league: tournamentData.opponent_league,
            format: tournamentData.format || null,
            status: tournamentData.status || 'in_progress',
            our_total_goals: 0,
            opponent_total_goals: 0,
            result: null,
            matches: []
        };
    } else {
        if (!existingData.matches) existingData.matches = [];
    }
    
    if (tournamentData.date !== undefined) existingData.date = tournamentData.date;
    if (tournamentData.opponent_league !== undefined) existingData.opponent_league = tournamentData.opponent_league;
    if (tournamentData.format !== undefined) existingData.format = tournamentData.format;
    if (tournamentData.status !== undefined) existingData.status = tournamentData.status;

    if (tournamentData.matches && tournamentData.matches.length > 0) {
        for (const newMatch of tournamentData.matches) {
            const isDuplicate = existingData.matches.some(existingMatch => {
                const samePlayer = existingMatch.player_id === newMatch.player_id;
                const sameTournament = existingMatch.tournament_id === newMatch.tournament_id;
                if (!samePlayer || !sameTournament) return false;

                if (existingMatch.match_index_in_tournament !== undefined && newMatch.match_index_in_tournament !== undefined) {
                    return existingMatch.match_index_in_tournament === newMatch.match_index_in_tournament;
                } else {
                    return existingMatch.opponent_display_name === newMatch.opponent_display_name &&
                           existingMatch.goals_for === newMatch.goals_for &&
                           existingMatch.goals_against === newMatch.goals_against;
                }
            });

            if (!isDuplicate) {
                existingData.matches.push(newMatch);
            }
        }
    }

    if (existingData.matches.length > 0) {
        let ourTotal = 0;
        let oppTotal = 0;
        for (const match of existingData.matches) {
            ourTotal += (match.goals_for || 0);
            oppTotal += (match.goals_against || 0);
        }
        existingData.our_total_goals = ourTotal;
        existingData.opponent_total_goals = oppTotal;

        if (ourTotal > oppTotal) {
            existingData.result = 'win';
        } else if (oppTotal > ourTotal) {
            existingData.result = 'loss';
        } else {
            existingData.result = 'draw';
        }
    } else {
        existingData.our_total_goals = 0;
        existingData.opponent_total_goals = 0;
        existingData.result = null;
    }

    writeJSON(filePath, existingData);
    return existingData;
}

/**
 * Create a new tournament.
 * @param {string} tournamentId - e.g. '2026-08-14_red-falcons'
 * @param {string} date - e.g. '2026-08-14'
 * @param {string} opponentLeague - e.g. 'Red Falcons'
 * @param {string|null} format - '4v4', '8v8', '16v16', '32v32', or null if unknown
 * @returns The new tournament object
 */
export function createTournament(tournamentId, date, opponentLeague, format = null) {
    const newTournament = {
        tournament_id: tournamentId,
        date: date,
        opponent_league: opponentLeague,
        format: format,
        status: 'in_progress',
        our_total_goals: 0,
        opponent_total_goals: 0,
        result: null,
        matches: []
    };
    saveTournament(newTournament);
    return newTournament;
}

/**
 * Load all tournaments and return as array.
 */
export function loadAllTournaments() {
    try {
        const files = readdirSync(TOURNAMENTS_DIR);
        const tournaments = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const tournament = readJSON(path.join(TOURNAMENTS_DIR, file));
                if (tournament) tournaments.push(tournament);
            }
        }
        return tournaments;
    } catch (e) {
        return [];
    }
}

/**
 * Get all tournaments with status 'in_progress'.
 * @returns Array of tournament objects
 */
export function getInProgressTournaments() {
    const all = loadAllTournaments();
    return all.filter(t => t.status === 'in_progress');
}

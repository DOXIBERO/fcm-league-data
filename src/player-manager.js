import { readdirSync, existsSync } from 'fs';
import path from 'path';
import { PLAYERS_DIR, readJSON, writeJSON, slugify, deriveResult, nowISO } from './utils.js';

/**
 * Load all player files and return as an array of player objects.
 */
export function loadAllPlayers() {
    if (!existsSync(PLAYERS_DIR)) return [];
    const files = readdirSync(PLAYERS_DIR).filter(f => f.endsWith('.json'));
    return files.map(file => {
        return readJSON(path.join(PLAYERS_DIR, file));
    }).filter(Boolean);
}

/**
 * Load a single player by player_id. Returns null if not found.
 */
export function loadPlayer(playerId) {
    const filePath = path.join(PLAYERS_DIR, `${playerId}.json`);
    return readJSON(filePath);
}

/**
 * Save player data. Additive merge.
 */
export function savePlayer(playerData) {
    const filePath = path.join(PLAYERS_DIR, `${playerData.player_id}.json`);
    const existing = readJSON(filePath);
    
    if (!existing) {
        writeJSON(filePath, playerData);
        return;
    }
    
    const existingMatches = existing.matches || [];
    const newMatches = playerData.matches || [];
    
    for (const newMatch of newMatches) {
        const isDuplicate = existingMatches.some(exMatch => {
            if (exMatch.tournament_id !== newMatch.tournament_id) return false;
            
            if (exMatch.match_index_in_tournament != null && newMatch.match_index_in_tournament != null) {
                return exMatch.match_index_in_tournament === newMatch.match_index_in_tournament;
            }
            
            return exMatch.opponent_display_name === newMatch.opponent_display_name &&
                   exMatch.goals_for === newMatch.goals_for &&
                   exMatch.goals_against === newMatch.goals_against;
        });
        
        if (!isDuplicate) {
            existingMatches.push(newMatch);
        }
    }
    
    existing.matches = existingMatches;
    
    if (playerData.display_name) existing.display_name = playerData.display_name;
    if (playerData.known_aliases) {
        const aliases = new Set([...(existing.known_aliases || []), ...playerData.known_aliases]);
        existing.known_aliases = Array.from(aliases);
    }
    if (playerData.eligibility_streak) existing.eligibility_streak = playerData.eligibility_streak;
    
    writeJSON(filePath, existing);
}

/**
 * Find a player by a display name string.
 */
export function findPlayerByName(name) {
    const players = loadAllPlayers();
    
    const normalize = (str) => str.toLowerCase().replace(/[_-\s]/g, '');
    const normName = normalize(name);
    const lowerName = name.toLowerCase();
    
    let exactMatches = [];
    let closeMatches = [];
    
    for (const p of players) {
        const names = [p.display_name, ...(p.known_aliases || [])];
        
        let foundExact = false;
        let foundClose = false;
        
        for (const n of names) {
            if (n.toLowerCase() === lowerName) {
                foundExact = true;
                break;
            } else if (normalize(n) === normName) {
                foundClose = true;
            }
        }
        
        if (foundExact) {
            exactMatches.push(p);
        } else if (foundClose) {
            closeMatches.push(p);
        }
    }
    
    if (exactMatches.length === 1) {
        return { match: 'exact', playerId: exactMatches[0].player_id, allCandidates: exactMatches };
    } else if (exactMatches.length > 1) {
        return { match: 'ambiguous', playerId: null, allCandidates: exactMatches };
    }
    
    if (closeMatches.length === 1) {
        return { match: 'close', playerId: closeMatches[0].player_id, allCandidates: closeMatches };
    } else if (closeMatches.length > 1) {
        return { match: 'ambiguous', playerId: null, allCandidates: closeMatches };
    }
    
    return { match: 'none', playerId: null, allCandidates: [] };
}

/**
 * Create a new player. Generate player_id via slugify.
 */
export function createPlayer(displayName) {
    let baseId = slugify(displayName);
    let playerId = baseId;
    let counter = 2;
    
    while (existsSync(path.join(PLAYERS_DIR, `${playerId}.json`))) {
        playerId = `${baseId}_${counter}`;
        counter++;
    }
    
    const player = {
        player_id: playerId,
        display_name: displayName,
        known_aliases: [],
        matches: [],
        eligibility_streak: {
            current_fail_streak: 0,
            last_evaluated_tournament_id: null,
            flagged_for_review: false
        }
    };
    
    savePlayer(player);
    return player;
}

/**
 * Add an alias to a player's known_aliases.
 */
export function addAlias(playerId, newAlias) {
    const player = loadPlayer(playerId);
    if (!player) return;
    
    if (!player.known_aliases) player.known_aliases = [];
    if (!player.known_aliases.includes(newAlias)) {
        player.known_aliases.push(newAlias);
        savePlayer(player);
    }
}

/**
 * Evaluate eligibility for a player in a specific tournament.
 */
export function updateEligibility(playerId) {
    const player = loadPlayer(playerId);
    if (!player) return;
    
    player.matches.sort((a, b) => a.tournament_id.localeCompare(b.tournament_id));
    
    let currentFailStreak = 0;
    let totalGoals = 0;
    
    for (const m of player.matches) {
        const passed = m.turns_played === 3 && m.goals_for >= 20;
        if (passed) {
            currentFailStreak = 0;
        } else {
            currentFailStreak += 1;
        }
        totalGoals += (m.goals_for || 0);
    }
    
    player.eligibility_streak = {
        current_fail_streak: currentFailStreak,
        last_evaluated_tournament_id: player.matches.length > 0 ? player.matches[player.matches.length - 1].tournament_id : null,
        flagged_for_review: currentFailStreak >= 3
    };
    
    player.average_goals = player.matches.length > 0 ? Math.round(totalGoals / player.matches.length) : 0;
    
    savePlayer(player);
}

import path from 'path';
import { REVIEW_DIR, writeJSON, readJSON, nowISO } from './utils.js';
import { readdirSync, unlinkSync } from 'fs';

/**
 * Create a review entry in _review/.
 * Filename: <timestamp>_<reason>.json
 * The timestamp should be filesystem-safe (no colons): e.g. 2026-08-14T220311Z_unreadable_score.json
 * 
 * @param {string} reason - one of: 'unreadable_score', 'ambiguous_player_identity', 'label_score_mismatch', 'no_tournament_context', 'not_a_match_result', 'partial_extraction'
 * @param {object} partialData - whatever was extractable (can be incomplete)
 * @param {string} screenshotPath - path to the raw screenshot
 * @param {string} [notes] - additional context
 * @returns The path to the created review file
 */
export function createReviewEntry(reason, partialData, screenshotPath, notes = '') {
    const isoString = nowISO();
    const safeTimestamp = isoString.replace(/:/g, '');
    const filename = `${safeTimestamp}_${reason}.json`;
    const filePath = path.join(REVIEW_DIR, filename);

    const reviewData = {
        reason,
        created_at: isoString,
        screenshot_path: screenshotPath,
        partial_data: partialData,
        notes
    };

    writeJSON(filePath, reviewData);
    return filePath;
}

/**
 * List all pending review entries.
 * @returns Array of { filename, reason, data } objects
 */
export function listPendingReviews() {
    try {
        const files = readdirSync(REVIEW_DIR);
        const reviews = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = readJSON(path.join(REVIEW_DIR, file));
                if (data) {
                    reviews.push({ filename: file, reason: data.reason, data });
                }
            }
        }
        return reviews;
    } catch (e) {
        return [];
    }
}

/**
 * Delete/resolve a review entry by filename.
 */
export function resolveReview(filename) {
    try {
        const filePath = path.join(REVIEW_DIR, filename);
        unlinkSync(filePath);
        return true;
    } catch (e) {
        return false;
    }
}

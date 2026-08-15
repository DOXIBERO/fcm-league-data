import simpleGit from 'simple-git';
import path from 'path';
import { LEAGUE_DATA_DIR } from './utils.js';

// Initialize simple-git at the repo root (parent of league-data)
const git = simpleGit(path.resolve('.'));

/**
 * Add the remote if not already set.
 * @param {string} remoteUrl - HTTPS URL with token embedded
 */
export async function ensureRemote(remoteUrl) {
  try {
    const remotes = await git.getRemotes(true);
    const origin = remotes.find(r => r.name === 'origin');
    
    if (!origin) {
      await git.addRemote('origin', remoteUrl);
    } else if (origin.refs.fetch !== remoteUrl && origin.refs.push !== remoteUrl) {
      await git.removeRemote('origin');
      await git.addRemote('origin', remoteUrl);
    }
  } catch (error) {
    console.error('Error ensuring remote:', error);
    throw error;
  }
}

/**
 * Stage all changes in league-data/, commit with the prescribed format, and push.
 * NEVER force-push. 
 * 
 * Commit message format:
 * - Subject: `data: <tournamentId> — <N> matches added (<M> players)`
 * - Body (if reviewCount > 0): `<R> screenshots moved to _review: <reasons>`
 * 
 * If matchCount is 0 and reviewCount > 0:
 * - Subject: `data: <tournamentId> — 0 matches confirmed, <R> flagged for review`
 * 
 * @param {string} tournamentId
 * @param {number} matchCount
 * @param {number} playerCount
 * @param {number} reviewCount
 * @param {string[]} reviewReasons - list of reason strings for the commit body
 */
export async function commitRun(tournamentId, matchCount, playerCount, reviewCount, reviewReasons = []) {
  try {
    await git.add('league-data/');
    
    const status = await git.status();
    const hasChanges = status.staged.length > 0;
    
    if (!hasChanges) {
      return { committed: false, message: 'No changes to commit.' };
    }
    
    let subject = '';
    if (matchCount === 0 && reviewCount > 0) {
      subject = `data: ${tournamentId} — 0 matches confirmed, ${reviewCount} flagged for review`;
    } else {
      subject = `data: ${tournamentId} — ${matchCount} matches added (${playerCount} players)`;
    }
    
    let commitMessage = subject;
    if (reviewCount > 0) {
      const reasonsStr = reviewReasons.join(', ');
      const body = `${reviewCount} screenshots moved to _review: ${reasonsStr}`;
      commitMessage = `${subject}\n\n${body}`;
    }
    
    await git.commit(commitMessage);
    return { committed: true, message: commitMessage };
  } catch (error) {
    console.error('Error during commitRun:', error);
    throw error;
  }
}

/**
 * Push to origin. Never force-push.
 */
export async function pushToRemote() {
  try {
    await git.push();
  } catch (error) {
    console.error('Error during pushToRemote:', error);
    throw error;
  }
}

/**
 * Ensure the repo is properly configured - no force push allowed.
 */
export async function ensureNeverForcePush() {
  try {
    // Set receive.denyNonFastForwards to true
    await git.addConfig('receive.denyNonFastForwards', 'true');
  } catch (error) {
    console.error('Error configuring receive.denyNonFastForwards:', error);
    throw error;
  }
}

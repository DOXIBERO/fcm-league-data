/* ============================================
   БРАТВА FC Mobile League Tracker — Application Logic
   Fetches JSON data & renders interactive mobile views
   ============================================ */

const DATA_BASE_PATHS = [
  './league-data',
  '../league-data',
  'league-data'
];

let dataBasePath = './league-data';

// Application State
const state = {
  playersIndex: {},
  tournamentsIndex: {},
  players: [],       // full loaded player objects
  tournaments: [],   // full loaded tournament objects
  activeTab: 'dashboard',
  searchQuery: '',
  leaderboardWindow: 'all', // 'all', '7', '30'
  leaderboardSort: 'goals'  // 'goals', 'winrate', 'matches', 'avg'
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupSearch();
  setupLeaderboardControls();
  setupModalDismissal();

  await loadData();
  renderAll();
});

// --- Data Loading ---
async function loadData() {
  // Test paths to find where league-data is located
  for (const path of DATA_BASE_PATHS) {
    try {
      const res = await fetch(`${path}/index/players_index.json`);
      if (res.ok) {
        dataBasePath = path;
        state.playersIndex = await res.json();
        break;
      }
    } catch (e) {}
  }

  try {
    const tRes = await fetch(`${dataBasePath}/index/tournaments_index.json`);
    if (tRes.ok) state.tournamentsIndex = await tRes.json();
  } catch (e) {
    console.error('Failed to load tournaments index:', e);
  }

  // Load all individual player JSONs
  const playerIds = Object.keys(state.playersIndex);
  const playerPromises = playerIds.map(id => 
    fetch(`${dataBasePath}/players/${id}.json`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );

  // Load all individual tournament JSONs
  const tournamentIds = Object.keys(state.tournamentsIndex);
  const tournamentPromises = tournamentIds.map(id =>
    fetch(`${dataBasePath}/tournaments/${id}.json`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );

  const [loadedPlayers, loadedTournaments] = await Promise.all([
    Promise.all(playerPromises),
    Promise.all(tournamentPromises)
  ]);

  state.players = loadedPlayers.filter(Boolean);
  state.tournaments = loadedTournaments.filter(Boolean);

  // Sort tournaments newest first
  state.tournaments.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// --- Navigation ---
function setupNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-page').forEach(page => {
    page.classList.toggle('active', page.id === `tab-${tabName}`);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Render Controller ---
function renderAll() {
  renderHeaderRecord();
  renderDashboard();
  renderTournaments();
  renderPlayers();
  renderLeaderboard();
}

// --- Header Record ---
function renderHeaderRecord() {
  const completed = state.tournaments.filter(t => t.status === 'complete');
  const wins = completed.filter(t => t.result === 'win').length;
  const losses = completed.filter(t => t.result === 'loss').length;
  const draws = completed.filter(t => t.result === 'draw').length;

  const container = document.getElementById('header-record');
  container.innerHTML = `
    <div class="record-badge">
      <span class="w">${wins}W</span> • <span class="d">${draws}D</span> • <span class="l">${losses}L</span>
    </div>
  `;
}

// --- Dashboard ---
function renderDashboard() {
  // 1. Hero Record
  const completed = state.tournaments.filter(t => t.status === 'complete');
  const wins = completed.filter(t => t.result === 'win').length;
  const losses = completed.filter(t => t.result === 'loss').length;
  const draws = completed.filter(t => t.result === 'draw').length;

  let totalGF = 0, totalGA = 0;
  state.tournaments.forEach(t => {
    totalGF += t.our_total_goals || 0;
    totalGA += t.opponent_total_goals || 0;
  });
  const gd = totalGF - totalGA;
  const winRate = completed.length > 0 ? ((wins / completed.length) * 100).toFixed(1) : '0.0';

  document.getElementById('hero-wins').textContent = wins;
  document.getElementById('hero-draws').textContent = draws;
  document.getElementById('hero-losses').textContent = losses;
  document.getElementById('hero-gd').textContent = `GD: ${gd > 0 ? '+' : ''}${gd}`;
  document.getElementById('hero-winrate').textContent = `Win Rate: ${winRate}%`;

  // 2. Recent Tournament
  const recentContainer = document.getElementById('recent-tournament');
  if (state.tournaments.length === 0) {
    recentContainer.innerHTML = `<p class="empty-state">No tournaments recorded yet.</p>`;
  } else {
    const t = state.tournaments[0]; // newest
    recentContainer.innerHTML = buildTournamentCardHTML(t);
    recentContainer.onclick = () => openTournamentModal(t.tournament_id);
  }

  // 3. Top Performers (All Time Goals)
  const topContainer = document.getElementById('top-performers');
  const playerStats = state.players.map(p => computePlayerStats(p)).filter(s => s.totalMatches > 0);
  playerStats.sort((a, b) => b.totalGoals - a.totalGoals);

  const top3 = playerStats.slice(0, 3);
  if (top3.length === 0) {
    topContainer.innerHTML = `<p class="empty-state">No matches recorded yet.</p>`;
  } else {
    topContainer.innerHTML = top3.map((s, idx) => `
      <div class="performer-card" onclick="openPlayerModal('${s.player_id}')">
        <div class="performer-rank rank-${idx + 1}">${idx + 1}</div>
        <div class="performer-info">
          <div class="performer-name">${escapeHTML(s.display_name)}${s.flagged ? ' ⚠️' : ''}</div>
          <div class="performer-meta">${s.totalMatches} matches • ${s.winRate}% win rate</div>
        </div>
        <div class="performer-stat">
          <div class="performer-stat-value">${s.totalGoals}</div>
          <div class="performer-stat-label">Goals</div>
        </div>
      </div>
    `).join('');
  }

  // 4. Flagged Section
  const flaggedSection = document.getElementById('flagged-section');
  const flaggedList = document.getElementById('flagged-list');
  const flaggedPlayers = state.players.filter(p => p.eligibility_streak?.flagged_for_review);

  if (flaggedPlayers.length > 0) {
    flaggedSection.style.display = 'block';
    flaggedList.innerHTML = flaggedPlayers.map(p => `
      <div class="flagged-card" onclick="openPlayerModal('${p.player_id}')">
        <div class="flagged-name">⚠️ ${escapeHTML(p.display_name)}</div>
        <div class="flagged-detail">${p.eligibility_streak.current_fail_streak} consecutive fails</div>
      </div>
    `).join('');
  } else {
    flaggedSection.style.display = 'none';
  }
}

// --- Tournaments Tab ---
function renderTournaments() {
  const container = document.getElementById('tournaments-list');
  if (state.tournaments.length === 0) {
    container.innerHTML = `<p class="empty-state">No tournaments available.</p>`;
    return;
  }
  container.innerHTML = state.tournaments.map(t => `
    <div class="card card-tournament" onclick="openTournamentModal('${t.tournament_id}')">
      ${buildTournamentCardHTML(t)}
    </div>
  `).join('');
}

function buildTournamentCardHTML(t) {
  const resultClass = t.result === 'win' ? 'result-win' : t.result === 'loss' ? 'result-loss' : 'result-draw';
  const resultText = t.result ? t.result.toUpperCase() : 'IN PROGRESS';

  return `
    <div class="tournament-header">
      <div class="tournament-opponent">vs ${escapeHTML(t.opponent_league)}</div>
      <div class="tournament-date">${t.date}</div>
    </div>
    <div class="tournament-score">
      <div class="score-side">
        <div class="score-team-name">Братва</div>
        <div class="score-value text-gradient">${t.our_total_goals}</div>
      </div>
      <div class="score-vs">VS</div>
      <div class="score-side">
        <div class="score-team-name">${escapeHTML(t.opponent_league)}</div>
        <div class="score-value">${t.opponent_total_goals}</div>
      </div>
    </div>
    <div style="text-align: center;">
      <span class="tournament-result-badge ${resultClass}">${resultText}</span>
    </div>
    <div class="tournament-meta">
      <span>Format: ${t.format || 'Unknown'}</span>
      <span>${(t.matches || []).length} participants</span>
    </div>
  `;
}

// --- Search & Players Tab ---
function setupSearch() {
  const input = document.getElementById('player-search');
  input.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderPlayers();
  });
}

function renderPlayers() {
  const container = document.getElementById('players-list');
  let filtered = state.players;

  if (state.searchQuery) {
    filtered = filtered.filter(p => 
      p.display_name.toLowerCase().includes(state.searchQuery) ||
      (p.known_aliases && p.known_aliases.some(a => a.toLowerCase().includes(state.searchQuery)))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p class="empty-state">No players found matching "${escapeHTML(state.searchQuery)}"</p>`;
    return;
  }

  // Sort alphabetically
  filtered.sort((a, b) => a.display_name.localeCompare(b.display_name));

  container.innerHTML = filtered.map(p => {
    const stats = computePlayerStats(p);
    const initial = p.display_name.trim().charAt(0).toUpperCase();
    return `
      <div class="player-row" onclick="openPlayerModal('${p.player_id}')">
        <div class="player-avatar">${initial}</div>
        <div class="player-row-info">
          <div class="player-row-name">${escapeHTML(p.display_name)}${stats.flagged ? ' ⚠️' : ''}</div>
          <div class="player-row-stats">${stats.totalMatches} matches • Win Rate: ${stats.winRate}%</div>
        </div>
        <div class="player-row-goals">${stats.totalGoals} GF</div>
      </div>
    `;
  }).join('');
}

// --- Leaderboard Tab ---
function setupLeaderboardControls() {
  // Window toggle (All time, 7d, 30d)
  const pills = document.querySelectorAll('#lb-toggle .pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.leaderboardWindow = pill.dataset.window;
      renderLeaderboard();
    });
  });

  // Sort buttons (goals, winrate, matches, avg)
  const sortBtns = document.querySelectorAll('.leaderboard-sort .sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.leaderboardSort = btn.dataset.sort;
      renderLeaderboard();
    });
  });
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-list');

  // Filter players by time window
  let statsList = state.players.map(p => computePlayerStats(p, state.leaderboardWindow)).filter(Boolean);

  if (statsList.length === 0) {
    container.innerHTML = `<p class="empty-state">No activity recorded for this period.</p>`;
    return;
  }

  // Sort
  statsList.sort((a, b) => {
    if (state.leaderboardSort === 'winrate') return b.winRate - a.winRate || b.totalGoals - a.totalGoals;
    if (state.leaderboardSort === 'matches') return b.totalMatches - a.totalMatches || b.totalGoals - a.totalGoals;
    if (state.leaderboardSort === 'avg') return b.avgGoals - a.avgGoals || b.totalGoals - a.totalGoals;
    return b.totalGoals - a.totalGoals; // default 'goals'
  });

  container.innerHTML = statsList.map((s, idx) => {
    let mainVal = s.totalGoals + ' G';
    if (state.leaderboardSort === 'winrate') mainVal = s.winRate + '%';
    if (state.leaderboardSort === 'matches') mainVal = s.totalMatches + ' M';
    if (state.leaderboardSort === 'avg') mainVal = s.avgGoals + ' avg';

    return `
      <div class="lb-row" onclick="openPlayerModal('${s.player_id}')">
        <div class="lb-rank rank-${idx + 1}">${idx + 1}</div>
        <div class="lb-info">
          <div class="lb-name">${escapeHTML(s.display_name)}${s.flagged ? ' ⚠️' : ''}</div>
          <div class="lb-meta">${s.totalMatches} matches • ${s.totalGoals} goals • ${s.winRate}% WR</div>
        </div>
        <div class="lb-value text-gradient">${mainVal}</div>
      </div>
    `;
  }).join('');
}

// --- Player Stats Helper ---
function computePlayerStats(player, windowDays = 'all') {
  if (!player || !player.matches) return null;

  let matches = player.matches;

  // Time window filtering
  if (windowDays !== 'all') {
    const days = parseInt(windowDays, 10);
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - days);

    matches = matches.filter(m => {
      const tInfo = state.tournamentsIndex[m.tournament_id];
      if (!tInfo) return false;
      return new Date(tInfo.date) >= cutoff;
    });
  }

  if (windowDays !== 'all' && matches.length === 0) return null;

  const totalMatches = matches.length;
  const totalGoals = matches.reduce((sum, m) => sum + (m.goals_for || 0), 0);
  const wins = matches.filter(m => m.result === 'win').length;
  const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0';
  const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : '0.00';

  return {
    player_id: player.player_id,
    display_name: player.display_name,
    totalMatches,
    totalGoals,
    wins,
    winRate: parseFloat(winRate),
    avgGoals: parseFloat(avgGoals),
    flagged: player.eligibility_streak?.flagged_for_review || false,
    streak: player.eligibility_streak?.current_fail_streak || 0,
    matches
  };
}

// --- Modals & Sheets ---
function setupModalDismissal() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });
}

function openPlayerModal(playerId) {
  const player = state.players.find(p => p.player_id === playerId);
  if (!player) return;

  const stats = computePlayerStats(player);
  const modal = document.getElementById('player-modal');
  const content = document.getElementById('player-modal-content');

  let eligClass = 'eligibility-ok';
  let eligText = 'Eligible (Streak: 0)';
  if (stats.flagged) {
    eligClass = 'eligibility-danger';
    eligText = `⚠️ FLAGGED FOR REVIEW (${stats.streak} consecutive fails)`;
  } else if (stats.streak > 0) {
    eligClass = 'eligibility-warn';
    eligText = `Warning (${stats.streak}/3 fail streak)`;
  }

  content.innerHTML = `
    <div class="modal-title">${escapeHTML(player.display_name)}</div>
    <div class="modal-subtitle">Career Overview</div>

    <div class="eligibility-bar ${eligClass}">
      <span>${eligText}</span>
    </div>

    <div class="modal-stat-grid">
      <div class="modal-stat-box">
        <div class="modal-stat-num text-gradient">${stats.totalGoals}</div>
        <div class="modal-stat-lbl">Goals</div>
      </div>
      <div class="modal-stat-box">
        <div class="modal-stat-num">${stats.totalMatches}</div>
        <div class="modal-stat-lbl">Matches</div>
      </div>
      <div class="modal-stat-box">
        <div class="modal-stat-num">${stats.avgGoals}</div>
        <div class="modal-stat-lbl">Avg / Match</div>
      </div>
    </div>

    <div class="modal-section-title">Tournament Appearances</div>
    <div class="modal-match-list">
      ${player.matches.length === 0 ? '<p class="empty-state">No tournament entries yet.</p>' : 
        player.matches.map(m => {
          const tInfo = state.tournamentsIndex[m.tournament_id] || {};
          return `
            <div class="modal-match-row">
              <div>
                <div style="font-weight: 700; font-size: 0.85rem;">vs ${escapeHTML(tInfo.opponent_league || m.opponent_display_name)}</div>
                <div style="font-size: 0.68rem; color: var(--text-muted);">${tInfo.date || ''} • ${m.turns_played || 3}/3 turns</div>
              </div>
              <div style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.1rem;" class="text-gradient">${m.goals_for} Goals</div>
            </div>
          `;
        }).join('')
      }
    </div>
  `;

  modal.style.display = 'flex';
}

function openTournamentModal(tournamentId) {
  const tournament = state.tournaments.find(t => t.tournament_id === tournamentId);
  if (!tournament) return;

  const modal = document.getElementById('tournament-modal');
  const content = document.getElementById('tournament-modal-content');

  const matches = tournament.matches || [];
  const sortedMatches = [...matches].sort((a, b) => b.goals_for - a.goals_for);

  content.innerHTML = `
    <div class="modal-title">vs ${escapeHTML(tournament.opponent_league)}</div>
    <div class="modal-subtitle">Tournament Details • ${tournament.date}</div>

    <div class="tournament-score" style="margin-bottom: var(--gap-lg);">
      <div class="score-side">
        <div class="score-team-name">Братва</div>
        <div class="score-value text-gradient">${tournament.our_total_goals}</div>
      </div>
      <div class="score-vs">VS</div>
      <div class="score-side">
        <div class="score-team-name">${escapeHTML(tournament.opponent_league)}</div>
        <div class="score-value">${tournament.opponent_total_goals}</div>
      </div>
    </div>

    <div class="modal-section-title">Member Performances (${sortedMatches.length})</div>
    <div class="modal-match-list">
      ${sortedMatches.map(m => `
        <div class="modal-match-row" onclick="openPlayerModal('${m.player_id}')" style="cursor: pointer;">
          <div>
            <div style="font-weight: 700; font-size: 0.85rem;">${escapeHTML(m.player_display_name || m.player_id)}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">${m.turns_played || 3}/3 turns played</div>
          </div>
          <div style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.1rem;" class="text-gradient">${m.goals_for} Goals</div>
        </div>
      `).join('')}
    </div>
  `;

  modal.style.display = 'flex';
}

// Utility: HTML escaping
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
}

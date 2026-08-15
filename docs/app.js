/* ============================================
   БРАТВА FC Mobile — Opera GX Esports Engine
   Multilingual i18n, Dynamic SVG Flags,
   TOTW Spotlight, Goal Share Gauges, SVG Charting
   ============================================ */

const SVG_FLAGS = {
  en: `<svg class="svg-flag" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="m75 0 245 180L565 0h75v55L400 240l240 185v55h-75L320 300 75 480H0v-55l240-185L0 55V0h75z"/><path fill="#C8102E" d="m425 300 215 165v15h-30L380 300h45zM175 180 0 45V30h30l215 165h-70zM0 435l215-165h45L30 480H0v-45zM640 45 425 210h-45L610 0h30v45z"/><path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M267 0v480h106V0H267zM0 187v106h640V187H0z"/></svg>`,
  ar: `<svg class="svg-flag" viewBox="0 0 640 480"><path fill="#007A3D" d="M0 0h640v160H0z"/><path fill="#FFF" d="M0 160h640v160H0z"/><path fill="#000" d="M0 320h640v160H0z"/><path fill="#CE1126" d="M0 0v480l240-240Z"/></svg>`,
  ru: `<svg class="svg-flag" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#0039a6" d="M0 160h640v160H0z"/><path fill="#d52b1e" d="M0 320h640v160H0z"/></svg>`,
  es: `<svg class="svg-flag" viewBox="0 0 640 480"><path fill="#aa151b" d="M0 0h640v120H0zM0 360h640v120H0z"/><path fill="#f1bf00" d="M0 120h640v240H0z"/></svg>`
};

const I18N = {
  en: {
    dir: 'ltr',
    league_record: 'League Overview',
    wins: 'Wins',
    draws: 'Draws',
    losses: 'Losses',
    recent_tournament: 'Recent Match Broadcast',
    totw_spotlight: 'Tournament MVP Spotlight',
    top_performers: 'Top Scorers',
    flagged_players: '⚠️ Flagged for Admin Review',
    tournament_history: 'Tournament History',
    player: 'Player',
    goals: 'Goals',
    matches: 'Matches',
    avg_goals: 'Avg GF',
    search_placeholder: 'Search player name...',
    all_time: 'All Time',
    window_7d: '7 Days',
    window_30d: '30 Days',
    nav_dash: 'Dash',
    nav_tournaments: 'Matches',
    nav_roster: 'Roster',
    nav_leaderboard: 'Stats',
    loading: 'Loading...',
    performance_chart: '7-Day Performance Trend',
    click_point_hint: 'Click data point for match breakdown',
    turns_completed: 'Turns Completed',
    verdict_excellent: 'EXCELLENT PERFORMANCE',
    verdict_underperformed: 'UNDERPERFORMED',
    verdict_absent: 'DID NOT PLAY / SKIPPED',
    verdict_no_tournament: 'NO TOURNAMENT HELD',
    eligibility_ok: 'ELIGIBLE (0 FAIL STREAK)',
    eligibility_warn: 'WARNING (FAIL STREAK: {n})',
    eligibility_flagged: '⚠️ FLAGGED (3 CONSECUTIVE FAILS)'
  },
  ar: {
    dir: 'rtl',
    league_record: 'نظرة عامة على الدوري',
    wins: 'انتصارات',
    draws: 'تعادلات',
    losses: 'هزائم',
    recent_tournament: 'البث المباشر لأحدث مباراة',
    totw_spotlight: 'نجوم المباراة الأخيرة',
    top_performers: 'أفضل الهدافين',
    flagged_players: '⚠️ مراجعة إدارية مطلوبة',
    tournament_history: 'سجل البطولات',
    player: 'اللاعب',
    goals: 'الأهداف',
    matches: 'المباريات',
    avg_goals: 'معدل الأهداف',
    search_placeholder: 'بحث عن اسم لاعب...',
    all_time: 'كل الأوقات',
    window_7d: '7 أيام',
    window_30d: '30 يوم',
    nav_dash: 'الرئيسية',
    nav_tournaments: 'المباريات',
    nav_roster: 'التشكيلة',
    nav_leaderboard: 'الإحصائيات',
    loading: 'جاري التحميل...',
    performance_chart: 'مؤشر الأداء (آخر 7 أيام)',
    click_point_hint: 'انقر على النقطة لعرض تفاصيل اليوم',
    turns_completed: 'المحاولات المكتملة',
    verdict_excellent: 'أداء ممتاز',
    verdict_underperformed: 'أداء ضعيف',
    verdict_absent: 'لم يشارك / غائب',
    verdict_no_tournament: 'لا توجد بطولة في هذا اليوم',
    eligibility_ok: 'مؤهل (سلسلة الفشل: 0)',
    eligibility_warn: 'تحذير (سلسلة الفشل: {n})',
    eligibility_flagged: '⚠️ مراجعة مطلوبة (3 إخفاقات متتالية)'
  },
  ru: {
    dir: 'ltr',
    league_record: 'Обзор лиги',
    wins: 'Победы',
    draws: 'Ничьи',
    losses: 'Поражения',
    recent_tournament: 'Трансляция последнего матча',
    totw_spotlight: 'Герои последнего матча',
    top_performers: 'Лучшие бомбардиры',
    flagged_players: '⚠️ Флаг проверки администратора',
    tournament_history: 'История турниров',
    player: 'Игрок',
    goals: 'Голы',
    matches: 'Матчи',
    avg_goals: 'Ср. голы',
    search_placeholder: 'Поиск игрока...',
    all_time: 'Все время',
    window_7d: '7 дней',
    window_30d: '30 дней',
    nav_dash: 'Главная',
    nav_tournaments: 'Матчи',
    nav_roster: 'Состав',
    nav_leaderboard: 'Статистика',
    loading: 'Загрузка...',
    performance_chart: 'График формы за 7 дней',
    click_point_hint: 'Нажмите на точку для деталей дня',
    turns_completed: 'Сыграно ходов',
    verdict_excellent: 'ОТЛИЧНЫЙ РЕЗУЛЬТАТ',
    verdict_underperformed: 'СЛАБЫЙ РЕЗУЛЬТАТ',
    verdict_absent: 'НЕ УЧАСТВОВАЛ / ПРОПУСК',
    verdict_no_tournament: 'ТУРНИР НЕ ПРОВОДИЛСЯ',
    eligibility_ok: 'ДОПУЩЕН (Серия провалов: 0)',
    eligibility_warn: 'ПРЕДУПРЕЖДЕНИЕ (Провалов: {n})',
    eligibility_flagged: '⚠️ ТРЕБУЕТСЯ ПРОВЕРКА (3 провала подряд)'
  },
  es: {
    dir: 'ltr',
    league_record: 'Resumen de Liga',
    wins: 'Victorias',
    draws: 'Empates',
    losses: 'Derrotas',
    recent_tournament: 'Última Transmisión',
    totw_spotlight: 'Jugadores Destacados',
    top_performers: 'Máximos Goleadores',
    flagged_players: '⚠️ Marcado para Revisión',
    tournament_history: 'Historial de Torneos',
    player: 'Jugador',
    goals: 'Goles',
    matches: 'Partidos',
    avg_goals: 'Prom. Goles',
    search_placeholder: 'Buscar jugador...',
    all_time: 'Todo el Tiempo',
    window_7d: '7 Días',
    window_30d: '30 Días',
    nav_dash: 'Inicio',
    nav_tournaments: 'Partidos',
    nav_roster: 'Plantilla',
    nav_leaderboard: 'Stats',
    loading: 'Cargando...',
    performance_chart: 'Tendencia de 7 Días',
    click_point_hint: 'Toca un punto para ver detalles',
    turns_completed: 'Turnos Jugados',
    verdict_excellent: 'RENDIMIENTO EXCELENTE',
    verdict_underperformed: 'BAJO RENDIMIENTO',
    verdict_absent: 'NO JUGÓ / AUSENTE',
    verdict_no_tournament: 'SIN TORNEO ESTE DÍA',
    eligibility_ok: 'ELEGIBLE (Racha fallos: 0)',
    eligibility_warn: 'ADVERTENCIA (Racha fallos: {n})',
    eligibility_flagged: '⚠️ REVISIÓN REQUERIDA (3 fallos seguidos)'
  }
};

const DATA_PATHS = ['./league-data', '../league-data', 'league-data'];
let activePath = './league-data';

const state = {
  lang: 'en',
  playersIndex: {},
  tournamentsIndex: {},
  players: [],
  tournaments: [],
  activeTab: 'dashboard',
  searchQuery: '',
  leaderboardWindow: 'all'
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  setupLanguageSelector();
  setupNavigation();
  setupSearch();
  setupFilterControls();

  await loadData();
  renderAll();
});

// --- Language Selector ---
function setupLanguageSelector() {
  const toggleBtn = document.getElementById('lang-toggle-btn');
  const menu = document.getElementById('lang-menu');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  document.addEventListener('click', () => menu.classList.remove('show'));

  const options = document.querySelectorAll('.lang-opt');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      setLanguage(opt.dataset.lang);
      menu.classList.remove('show');
    });
  });
}

function setLanguage(langCode) {
  if (!I18N[langCode]) return;
  state.lang = langCode;
  const dict = I18N[langCode];

  // Set HTML direction (RTL / LTR) & language attribute
  document.documentElement.setAttribute('dir', dict.dir);
  document.documentElement.setAttribute('lang', langCode);

  // Update SVG Flag & Language Code in Header
  document.getElementById('current-flag-container').innerHTML = SVG_FLAGS[langCode];
  document.getElementById('current-lang-code').textContent = langCode.toUpperCase();

  // Translate DOM elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (dict[key]) el.placeholder = dict[key];
  });

  renderAll();
}

function t(key, vars = {}) {
  const dict = I18N[state.lang] || I18N.en;
  let str = dict[key] || I18N.en[key] || key;
  Object.keys(vars).forEach(k => {
    str = str.replace(`{${k}}`, vars[k]);
  });
  return str;
}

// --- Data Fetching ---
async function loadData() {
  for (const path of DATA_PATHS) {
    try {
      const res = await fetch(`${path}/index/players_index.json`);
      if (res.ok) {
        activePath = path;
        state.playersIndex = await res.json();
        break;
      }
    } catch (e) {}
  }

  try {
    const tRes = await fetch(`${activePath}/index/tournaments_index.json`);
    if (tRes.ok) state.tournamentsIndex = await tRes.json();
  } catch (e) {}

  const pIds = Object.keys(state.playersIndex);
  const pPromises = pIds.map(id => fetch(`${activePath}/players/${id}.json`).then(r => r.ok ? r.json() : null).catch(() => null));

  const tIds = Object.keys(state.tournamentsIndex);
  const tPromises = tIds.map(id => fetch(`${activePath}/tournaments/${id}.json`).then(r => r.ok ? r.json() : null).catch(() => null));

  const [pResults, tResults] = await Promise.all([Promise.all(pPromises), Promise.all(tPromises)]);

  state.players = pResults.filter(Boolean);
  state.tournaments = tResults.filter(Boolean);
  state.tournaments.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// --- Navigation ---
function setupNavigation() {
  const navs = document.querySelectorAll('.nav-item');
  navs.forEach(nav => {
    nav.addEventListener('click', () => {
      navs.forEach(n => n.classList.remove('active'));
      nav.classList.add('active');
      switchTab(nav.dataset.tab);
    });
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll('.tab-page').forEach(p => p.classList.toggle('active', p.id === `tab-${tabName}`));
}

// --- Renderers ---
function renderAll() {
  renderDashboard();
  renderTournaments();
  renderRoster();
  renderLeaderboard();
}

function renderDashboard() {
  const completed = state.tournaments.filter(t => t.status === 'complete');
  const wins = completed.filter(t => t.result === 'win').length;
  const losses = completed.filter(t => t.result === 'loss').length;
  const draws = completed.filter(t => t.result === 'draw').length;

  const winRate = completed.length > 0 ? ((wins / completed.length) * 100).toFixed(1) : '0.0';

  document.getElementById('hero-wins').textContent = wins;
  document.getElementById('hero-draws').textContent = draws;
  document.getElementById('hero-losses').textContent = losses;
  document.getElementById('hero-winrate-badge').textContent = `${winRate}% W/R`;

  // Recent match + Goal Share Gauge Bar
  const recentBox = document.getElementById('recent-match-container');
  if (state.tournaments.length === 0) {
    recentBox.innerHTML = `<div style="text-align:center; padding:12px; color:var(--text-muted);">${t('loading')}</div>`;
  } else {
    const tItem = state.tournaments[0];
    const badgeClass = tItem.result === 'win' ? 't-badge-win' : tItem.result === 'loss' ? 't-badge-loss' : 't-badge-draw';
    
    // Calculate Goal Gauge Percentages
    const totalGoals = (tItem.our_total_goals || 0) + (tItem.opponent_total_goals || 0);
    const ourPct = totalGoals > 0 ? ((tItem.our_total_goals / totalGoals) * 100).toFixed(1) : 50;
    const oppPct = totalGoals > 0 ? ((tItem.opponent_total_goals / totalGoals) * 100).toFixed(1) : 50;

    recentBox.innerHTML = `
      <div class="t-card pulse-hover" onclick="openTournamentModal('${tItem.tournament_id}')">
        <div class="t-banner">
          <div class="t-team">
            <span class="t-team-name">Братва</span>
            <span class="t-score">${tItem.our_total_goals}</span>
          </div>
          <div style="font-weight:900; color:var(--text-muted); font-size:0.8rem;">VS</div>
          <div class="t-team">
            <span class="t-team-name">${escapeHTML(tItem.opponent_league)}</span>
            <span class="t-score">${tItem.opponent_total_goals}</span>
          </div>
        </div>

        <!-- Broadcast Goal Gauge Progress Bar -->
        <div class="goal-gauge-wrap" title="Goal Share Split">
          <div class="goal-gauge-our" style="width: ${ourPct}%;"></div>
          <div class="goal-gauge-opp" style="width: ${oppPct}%;"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <span class="tag-badge ${badgeClass}">${tItem.result ? tItem.result.toUpperCase() : 'IN PROGRESS'}</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">${tItem.date}</span>
        </div>
      </div>
    `;

    // Render TOTW (Team of the Tournament Spotlight)
    renderTOTW(tItem);
  }

  // Top performers
  const topTbody = document.getElementById('top-performers-tbody');
  const sortedPlayers = [...state.players].sort((a, b) => getPlayerGoals(b) - getPlayerGoals(a));
  const top3 = sortedPlayers.slice(0, 3);

  topTbody.innerHTML = top3.map((p, idx) => `
    <tr class="data-row" onclick="openPlayerModal('${p.player_id}')">
      <td class="rank-cell rank-${idx + 1}">${idx + 1}</td>
      <td><strong>${escapeHTML(p.display_name)}</strong></td>
      <td style="text-align:right; font-weight:800; color:var(--gx-red);">${getPlayerGoals(p)}</td>
      <td style="text-align:right; color:var(--text-muted);">${p.matches ? p.matches.length : 0}</td>
    </tr>
  `).join('');

  // Flagged Section
  const flaggedBox = document.getElementById('flagged-card-box');
  const flaggedList = document.getElementById('flagged-players-list');
  const flagged = state.players.filter(p => p.eligibility_streak?.flagged_for_review);

  if (flagged.length > 0) {
    flaggedBox.style.display = 'block';
    flaggedList.innerHTML = flagged.map(p => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer;" onclick="openPlayerModal('${p.player_id}')">
        <span style="font-weight:700;">${escapeHTML(p.display_name)}</span>
        <span class="tag-badge t-badge-loss">${p.eligibility_streak.current_fail_streak} FAILS</span>
      </div>
    `).join('');
  } else {
    flaggedBox.style.display = 'none';
  }
}

// Render Team of the Tournament Spotlight Banner
function renderTOTW(recentTournament) {
  const totwBox = document.getElementById('totw-container');
  if (!recentTournament || !recentTournament.matches || recentTournament.matches.length === 0) {
    document.getElementById('totw-card-box').style.display = 'none';
    return;
  }

  document.getElementById('totw-card-box').style.display = 'block';

  // Sort match entries by goals descending
  const sorted = [...recentTournament.matches].sort((a, b) => b.goals_for - a.goals_for).slice(0, 3);

  totwBox.innerHTML = sorted.map((m, idx) => `
    <div class="totw-card" onclick="openPlayerModal('${m.player_id}')">
      <div class="totw-badge">${idx === 0 ? '👑 MVP' : `#${idx + 1} TOP`}</div>
      <div class="totw-name">${escapeHTML(m.player_display_name || m.player_id)}</div>
      <div class="totw-score">${m.goals_for} G</div>
    </div>
  `).join('');
}

function renderTournaments() {
  const container = document.getElementById('tournaments-list-container');
  container.innerHTML = state.tournaments.map(tItem => {
    const badgeClass = tItem.result === 'win' ? 't-badge-win' : tItem.result === 'loss' ? 't-badge-loss' : 't-badge-draw';
    
    const totalGoals = (tItem.our_total_goals || 0) + (tItem.opponent_total_goals || 0);
    const ourPct = totalGoals > 0 ? ((tItem.our_total_goals / totalGoals) * 100).toFixed(1) : 50;
    const oppPct = totalGoals > 0 ? ((tItem.opponent_total_goals / totalGoals) * 100).toFixed(1) : 50;

    return `
      <div class="t-card pulse-hover" style="margin-bottom:12px;" onclick="openTournamentModal('${tItem.tournament_id}')">
        <div class="t-banner">
          <div class="t-team">
            <span class="t-team-name">Братва</span>
            <span class="t-score">${tItem.our_total_goals}</span>
          </div>
          <div style="font-weight:900; color:var(--text-muted); font-size:0.8rem;">VS</div>
          <div class="t-team">
            <span class="t-team-name">${escapeHTML(tItem.opponent_league)}</span>
            <span class="t-score">${tItem.opponent_total_goals}</span>
          </div>
        </div>

        <div class="goal-gauge-wrap">
          <div class="goal-gauge-our" style="width: ${ourPct}%;"></div>
          <div class="goal-gauge-opp" style="width: ${oppPct}%;"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <span class="tag-badge ${badgeClass}">${tItem.result ? tItem.result.toUpperCase() : 'IN PROGRESS'}</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">${tItem.date} • ${tItem.format || '32v32'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setupSearch() {
  document.getElementById('roster-search-input').addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderRoster();
  });
}

function renderRoster() {
  const tbody = document.getElementById('roster-tbody');
  let list = state.players;

  if (state.searchQuery) {
    list = list.filter(p => p.display_name.toLowerCase().includes(state.searchQuery));
  }

  list.sort((a, b) => a.display_name.localeCompare(b.display_name));

  tbody.innerHTML = list.map(p => `
    <tr class="data-row" onclick="openPlayerModal('${p.player_id}')">
      <td>
        <strong>${escapeHTML(p.display_name)}</strong>
        ${p.eligibility_streak?.flagged_for_review ? ' <span class="tag-badge t-badge-loss">FLAGGED</span>' : ''}
      </td>
      <td style="text-align:center; color:var(--text-sub);">${p.matches ? p.matches.length : 0}</td>
      <td style="text-align:right; font-weight:800; color:var(--gx-red);">${getPlayerGoals(p)}</td>
    </tr>
  `).join('');
}

function setupFilterControls() {
  document.querySelectorAll('.filter-bar .btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-bar .btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.leaderboardWindow = btn.dataset.window;
      renderLeaderboard();
    });
  });
}

function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-tbody');
  const windowDays = state.leaderboardWindow;

  let list = state.players.map(p => {
    let matches = p.matches || [];
    if (windowDays !== 'all') {
      const days = parseInt(windowDays, 10);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      matches = matches.filter(m => {
        const tInfo = state.tournamentsIndex[m.tournament_id];
        return tInfo && new Date(tInfo.date) >= cutoff;
      });
    }
    if (windowDays !== 'all' && matches.length === 0) return null;

    const goals = matches.reduce((sum, m) => sum + (m.goals_for || 0), 0);
    const avg = matches.length > 0 ? (goals / matches.length).toFixed(1) : '0.0';

    return { player_id: p.player_id, display_name: p.display_name, goals, matchesCount: matches.length, avg };
  }).filter(Boolean);

  list.sort((a, b) => b.goals - a.goals);

  tbody.innerHTML = list.map((item, idx) => `
    <tr class="data-row" onclick="openPlayerModal('${item.player_id}')">
      <td class="rank-cell rank-${idx + 1}">${idx + 1}</td>
      <td><strong>${escapeHTML(item.display_name)}</strong></td>
      <td style="text-align:right; font-weight:800; color:var(--gx-red);">${item.goals}</td>
      <td style="text-align:right; color:var(--text-sub);">${item.avg}</td>
    </tr>
  `).join('');
}

// --- Player Detail Modal & 7-Day SVG Performance Chart ---
function openPlayerModal(playerId) {
  const player = state.players.find(p => p.player_id === playerId);
  if (!player) return;

  const backdrop = document.getElementById('player-modal');
  const content = document.getElementById('modal-player-content');

  document.getElementById('modal-close-x').onclick = () => backdrop.style.display = 'none';
  backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.style.display = 'none'; };

  const streak = player.eligibility_streak?.current_fail_streak || 0;
  const isFlagged = player.eligibility_streak?.flagged_for_review;

  let eligHTML = `<div class="tag-badge t-badge-win" style="margin-bottom:12px; width:100%; text-align:center;">${t('eligibility_ok')}</div>`;
  if (isFlagged) {
    eligHTML = `<div class="tag-badge t-badge-loss" style="margin-bottom:12px; width:100%; text-align:center;">${t('eligibility_flagged')}</div>`;
  } else if (streak > 0) {
    eligHTML = `<div class="tag-badge t-badge-draw" style="margin-bottom:12px; width:100%; text-align:center;">${t('eligibility_warn', { n: streak })}</div>`;
  }

  const chartData = build7DayPerformanceData(player);

  content.innerHTML = `
    <div style="font-family:var(--font-display); font-size:1.4rem; font-weight:900; margin-bottom:4px;">${escapeHTML(player.display_name)}</div>
    ${eligHTML}

    <div class="card-title-sm" style="margin:12px 0 6px;">
      <svg class="icon-svg" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18"/></svg>
      ${t('performance_chart')}
    </div>
    <div style="font-size:0.65rem; color:var(--text-muted); margin-bottom:8px;">${t('click_point_hint')}</div>

    <!-- Chart Container -->
    <div class="chart-container">
      <div id="chart-tooltip" class="chart-tooltip" style="display:none;"></div>
      ${renderSVGPerformanceChart(chartData)}
    </div>

    <!-- Active Point Summary Card -->
    <div id="chart-point-summary" class="hero-metric" style="margin-bottom:14px; text-align:left; padding:10px;">
      <div style="font-size:0.7rem; color:var(--text-muted);" id="summary-date-label">Tap any point above for details</div>
      <div style="font-weight:800; font-size:0.9rem; margin-top:2px;" id="summary-verdict-label">-</div>
    </div>

    <div class="card-title-sm">${t('tournament_history')}</div>
    <div style="max-height:160px; overflow-y:auto;">
      ${(player.matches || []).map(m => `
        <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.78rem;">
          <span>vs ${escapeHTML(m.opponent_display_name)}</span>
          <span style="font-weight:800; color:var(--gx-red);">${m.goals_for} Goals (${m.turns_played || 3}/3 turns)</span>
        </div>
      `).join('')}
    </div>
  `;

  backdrop.style.display = 'flex';
  attachChartPointListeners(chartData);
}

function build7DayPerformanceData(player) {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ dateStr, dayLabel: d.toLocaleDateString(state.lang, { weekday: 'short' }), match: null, status: 'no_tournament' });
  }

  (player.matches || []).forEach(m => {
    const tInfo = state.tournamentsIndex[m.tournament_id];
    const matchDate = tInfo ? tInfo.date : null;
    if (matchDate) {
      const dayObj = days.find(d => d.dateStr === matchDate);
      if (dayObj) {
        dayObj.match = m;
        dayObj.tournament = tInfo;
        const goals = m.goals_for || 0;
        const turns = m.turns_played || 3;
        if (turns === 3 && goals >= 20) {
          dayObj.status = 'great';
        } else if (turns === 0) {
          dayObj.status = 'absent';
        } else {
          dayObj.status = 'bad';
        }
      }
    }
  });

  return days;
}

function renderSVGPerformanceChart(daysData) {
  const svgWidth = 320;
  const svgHeight = 130;
  const paddingX = 25;
  const paddingY = 20;

  const stepX = (svgWidth - paddingX * 2) / (daysData.length - 1);

  const getY = (goals) => {
    const maxG = 40;
    const g = Math.min(Math.max(goals, 0), maxG);
    return svgHeight - paddingY - (g / maxG) * (svgHeight - paddingY * 2);
  };

  const points = daysData.map((d, i) => {
    const x = paddingX + i * stepX;
    const goals = d.match ? d.match.goals_for || 0 : 0;
    const y = getY(goals);
    return { x, y, goals, data: d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return `
    <svg class="chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <defs>
        <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff0038" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#ff0038" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <line x1="${paddingX}" y1="${svgHeight - paddingY}" x2="${svgWidth - paddingX}" y2="${svgHeight - paddingY}" class="chart-axis-line" />
      <path d="${areaD}" class="chart-area" />
      <path d="${pathD}" class="chart-path" />

      ${points.map((p, i) => {
        let ptClass = 'point-none';
        if (p.data.status === 'great') ptClass = 'point-great';
        if (p.data.status === 'bad') ptClass = 'point-bad';
        return `
          <circle cx="${p.x}" cy="${p.y}" class="chart-point ${ptClass}" data-index="${i}" />
          <text x="${p.x}" y="${svgHeight - 4}" font-size="8" fill="#666677" text-anchor="middle">${p.data.dayLabel}</text>
        `;
      }).join('')}
    </svg>
  `;
}

function attachChartPointListeners(daysData) {
  const points = document.querySelectorAll('.chart-point');
  const summaryDate = document.getElementById('summary-date-label');
  const summaryVerdict = document.getElementById('summary-verdict-label');

  points.forEach(pt => {
    pt.addEventListener('click', () => {
      const idx = parseInt(pt.dataset.index, 10);
      const d = daysData[idx];

      summaryDate.textContent = `${d.dateStr} (${d.dayLabel})`;

      if (d.status === 'no_tournament') {
        summaryVerdict.innerHTML = `<span style="color:var(--text-muted);">${t('verdict_no_tournament')}</span>`;
      } else if (d.status === 'absent') {
        summaryVerdict.innerHTML = `<span class="text-loss">${t('verdict_absent')}</span>`;
      } else if (d.status === 'great') {
        summaryVerdict.innerHTML = `
          <span class="text-win">${t('verdict_excellent')} (${d.match.goals_for} Goals)</span>
          <div style="font-size:0.75rem; color:var(--text-sub); margin-top:2px;">vs ${escapeHTML(d.match.opponent_display_name)} • ${d.match.turns_played || 3}/3 ${t('turns_completed')}</div>
        `;
      } else {
        summaryVerdict.innerHTML = `
          <span class="text-loss">${t('verdict_underperformed')} (${d.match.goals_for} Goals)</span>
          <div style="font-size:0.75rem; color:var(--text-sub); margin-top:2px;">vs ${escapeHTML(d.match.opponent_display_name)} • ${d.match.turns_played || 0}/3 ${t('turns_completed')}</div>
        `;
      }
    });
  });
}

function openTournamentModal(tId) {
  const tItem = state.tournaments.find(t => t.tournament_id === tId);
  if (!tItem) return;

  const backdrop = document.getElementById('player-modal');
  const content = document.getElementById('modal-player-content');

  document.getElementById('modal-close-x').onclick = () => backdrop.style.display = 'none';
  backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.style.display = 'none'; };

  const matches = [...(tItem.matches || [])].sort((a, b) => b.goals_for - a.goals_for);

  content.innerHTML = `
    <div style="font-family:var(--font-display); font-size:1.3rem; font-weight:900;">vs ${escapeHTML(tItem.opponent_league)}</div>
    <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">${tItem.date} • ${tItem.format || '32v32'}</div>

    <div class="t-banner" style="margin-bottom:16px;">
      <div class="t-team">
        <span class="t-team-name">Братва</span>
        <span class="t-score">${tItem.our_total_goals}</span>
      </div>
      <div style="font-weight:900; color:var(--text-muted);">VS</div>
      <div class="t-team">
        <span class="t-team-name">${escapeHTML(tItem.opponent_league)}</span>
        <span class="t-score">${tItem.opponent_total_goals}</span>
      </div>
    </div>

    <div class="card-title-sm">${t('player')} Scores (${matches.length})</div>
    <div style="max-height:220px; overflow-y:auto;">
      ${matches.map(m => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.8rem; cursor:pointer;" onclick="openPlayerModal('${m.player_id}')">
          <span><strong>${escapeHTML(m.player_display_name || m.player_id)}</strong> (${m.turns_played || 3}/3 turns)</span>
          <span style="font-weight:800; color:var(--gx-red);">${m.goals_for} G</span>
        </div>
      `).join('')}
    </div>
  `;

  backdrop.style.display = 'flex';
}

function getPlayerGoals(player) {
  return (player.matches || []).reduce((sum, m) => sum + (m.goals_for || 0), 0);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

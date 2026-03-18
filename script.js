
const state = {
  activeView: 'home'
};

const TYPE_LABELS = {
  meditation: 'Медитация',
  lecture: 'Лекция',
  practice: 'Практика',
  material: 'Материал',
  podcast: 'Размышление'
};

const VIEW_META = {
  home: {
    title: '',
    subtitle: 'Я очень рад, что вы здесь! Впереди чудесный мир открытия себя.',
    theme: 'theme-home'
  },
  'full-path': {
    title: 'Основной маршрут',
    subtitle: 'последовательная система лекций, медитаций и практик. Ты проходишь её в своём темпе: от знакомства с собой к освобождению, принятию и пониманию. Не торопись. Возвращайся если необходимо переслушать.',
    theme: 'theme-path'
  },
  meditations: {
    title: 'Медитации',
    subtitle: 'Практики выхода в состояние наблюдателя — в ту точку сознания, из которой человек может по-настоящему увидеть себя.',
    theme: 'theme-meditations'
  },
  lectures: {
    title: 'Лекции',
    subtitle: 'Структурные материалы для глубокого понимания и вдумчивого изучения.',
    theme: 'theme-lectures'
  },
  practices: {
    title: 'Практики и техники',
    subtitle: 'Телесные и прикладные инструменты, которые начинают работать сразу после применения.',
    theme: 'theme-practices'
  },
  materials: {
    title: 'Материалы',
    subtitle: 'Вспомогательные таблицы, списки и практики, чтобы всё было в одном месте.',
    theme: 'theme-materials'
  },
  addiction: {
    title: 'Работа с зависимостью',
    subtitle: 'Здесь собрано всё важное для тяги, срыва, восстановления, мотивации и удержания пути.',
    theme: 'theme-start'
  }
};

const ICONS = {
  meditations: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 5v4"/>
      <path d="M8.5 9.5c0 1.6 1.1 3 3.5 3s3.5-1.4 3.5-3"/>
      <path d="M6 18c1.5-2.6 3.7-4 6-4s4.5 1.4 6 4"/>
      <path d="M4 12.5c1.4 0 2.5 1.1 2.5 2.5S5.4 17.5 4 17.5"/>
      <path d="M20 12.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5"/>
    </svg>`,
  lectures: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.5 6.5c0-1.1.9-2 2-2H19v14.5H8.5c-1.1 0-2 .9-2 2"/>
      <path d="M8.5 4.5v16.5"/>
      <path d="M10.5 8.5h5"/>
      <path d="M10.5 11.5h5"/>
    </svg>`,
  practices: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3v4"/>
      <path d="M12 17v4"/>
      <path d="M4.2 7.2l2.8 2.8"/>
      <path d="M17 14l2.8 2.8"/>
      <path d="M3 12h4"/>
      <path d="M17 12h4"/>
      <path d="M4.2 16.8L7 14"/>
      <path d="M17 10l2.8-2.8"/>
      <circle cx="12" cy="12" r="3.5"/>
    </svg>`,
  addiction: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M8.5 8.5a3.5 3.5 0 0 1 5 0l2 2a3.5 3.5 0 0 1 0 5 3.5 3.5 0 0 1-5 0L9 14"/>
      <path d="M15.5 15.5a3.5 3.5 0 0 1-5 0l-2-2a3.5 3.5 0 0 1 0-5 3.5 3.5 0 0 1 5 0L15 10"/>
    </svg>`,
  materials: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 4.5h7l3 3V19.5H7z"/>
      <path d="M14 4.5v3h3"/>
      <path d="M9.5 12h5"/>
      <path d="M9.5 15h5"/>
    </svg>`
};

function byId(id) {
  return document.getElementById(id);
}

function itemMap() {
  const map = new Map();
  window.APP_DATA.items.forEach(item => map.set(item.id, item));
  return map;
}

const ITEMS = itemMap();

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function listItem(item) {
  return `
    <a class="list-item" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
      <span class="list-item-title">${escapeHtml(item.title)}</span>
      <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
    </a>
  `;
}

function pathListItem(item) {
  return `
    <a class="path-item" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
      <span class="list-item-title">${escapeHtml(item.title)}</span>
      <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
    </a>
  `;
}

function plannedPhaseCard(phase) {
  return `
    <article class="phase phase-planned fade-up fade-2 is-static">
      <div class="phase-static-head">
        <div>
          <div class="phase-title">${escapeHtml(phase.title)}</div>
          <div class="phase-desc">${escapeHtml(phase.description)}</div>
        </div>
        <span class="phase-badge">Скоро</span>
      </div>
    </article>
  `;
}

function availablePhaseCard(phase) {
  const items = (phase.items || [])
    .map(id => ITEMS.get(id))
    .filter(Boolean)
    .map(pathListItem)
    .join('');

  return `
    <details class="phase">
      <summary>
        <div>
          <div class="phase-title">${escapeHtml(phase.title)}</div>
          <div class="phase-desc">${escapeHtml(phase.description)}</div>
        </div>
        <span class="phase-chevron" aria-hidden="true"></span>
      </summary>
      <div class="phase-content">
        <div class="path-list">${items}</div>
      </div>
    </details>
  `;
}

function renderHome() {
  const hero = window.APP_DATA.sections.find(section => section.id === 'full-path');
  const secondary = window.APP_DATA.sections.filter(section => section.id !== 'full-path');
  const topTiles = secondary.slice(0, 4);
  const bottomTile = secondary[4];

  return `
    <section class="view-shell home-shell">
      <section class="hero-card hero-card-simple clickable fade-up fade-1" data-view="full-path">
        <div class="hero-card-text">
          <h2>${escapeHtml(hero.title)}</h2>
          <p>${escapeHtml(hero.description)}</p>
        </div>
        <div class="hero-card-arrow" aria-hidden="true"></div>
      </section>

      <section class="secondary-grid fade-up fade-2">
        ${topTiles.map(section => `
          <article class="mini-card clickable" data-view="${escapeHtml(section.id)}">
            <div class="mini-icon">${ICONS[section.id] || ''}</div>
            <div class="mini-title">${escapeHtml(section.title)}</div>
          </article>
        `).join('')}
      </section>

      ${bottomTile ? `
      <section class="wide-tile-wrap fade-up fade-3">
        <article class="mini-card mini-card-wide clickable" data-view="${escapeHtml(bottomTile.id)}">
          <div class="mini-icon">${ICONS[bottomTile.id] || ''}</div>
          <div class="mini-title">${escapeHtml(bottomTile.title)}</div>
        </article>
      </section>` : ''}
    </section>
  `;
}

function renderCurated(viewId) {
  const ids = window.APP_DATA.curated[viewId] || [];
  const items = ids
    .map(id => ITEMS.get(id))
    .filter(Boolean)
    .map(listItem)
    .join('');

  return `
    <section class="view-shell">
      <section class="list-wrap fade-up fade-1">${items}</section>
    </section>
  `;
}

function animateContentSwap(root, html) {
  root.classList.remove('is-visible');
  requestAnimationFrame(() => {
    root.innerHTML = html;
    requestAnimationFrame(() => {
      root.classList.add('is-visible');
      bindClicks();
    });
  });
}

function renderView() {
  const root = byId('app');
  const meta = VIEW_META[state.activeView] || VIEW_META.home;

  document.body.className = meta.theme;
  byId('pageTitle').textContent = meta.title;
  byId('pageTitle').classList.remove('is-letter-title');
  byId('pageSubtitle').textContent = meta.subtitle;
  byId('backBtn').hidden = state.activeView === 'home';

  let html = '';
  if (state.activeView === 'home') {
    html = renderHome();
  } else if (state.activeView === 'full-path') {
    html = renderFullPath();
  } else {
    html = renderCurated(state.activeView);
  }

  animateContentSwap(root, html);
}

function bindClicks() {
  document.querySelectorAll('[data-view]').forEach(node => {
    node.addEventListener('click', (event) => {
      const target = event.currentTarget || event.target.closest('[data-view]');
      if (!target) return;
      state.activeView = target.dataset.view;
      renderView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  byId('brandTitle').textContent = window.APP_DATA.brand.title;
  byId('backBtn').addEventListener('click', () => {
    state.activeView = 'home';
    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const root = byId('app');
  root.classList.add('app-fade');
  renderView();
});

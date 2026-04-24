// =========================================================
// TELEGRAM MINI APP
// =========================================================
const tg = window.Telegram?.WebApp || null;

// =========================================================
// 1. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// =========================================================
const state = {
  activeView: 'home'
};

// =========================================================
// 2. ПОДПИСИ ТИПОВ МАТЕРИАЛОВ
// =========================================================
const TYPE_LABELS = {
  meditation: 'Медитация',
  lecture: 'Лекция',
  practice: 'Практика',
  material: 'Материал',
  podcast: 'Размышление'
};

// =========================================================
// 3. МЕТА-ДАННЫЕ ЭКРАНОВ
// =========================================================
const VIEW_META = {
  home: {
    title: '',
    subtitle: '',
    theme: 'theme-home'
  },
  'full-path': {
    title: 'Основной маршрут',
    subtitle: 'Последовательный путь через лекции, практики и медитации. Начни смотреть сначала. Проходи этапы в своём темпе и возвращайся к важным моментам.',
    theme: 'theme-path'
  },
  meditations: {
    title: 'Медитации',
    subtitle: 'Практики выхода в состояние наблюдателя.',
    theme: 'theme-meditations'
  },
  lectures: {
    title: 'Лекции',
    subtitle: 'Структурные материалы для глубокого понимания и вдумчивого изучения.',
    theme: 'theme-lectures'
  },
  practices: {
    title: 'Техники',
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
    subtitle: 'Ответы на вопросы о зависимости, восстановлении, мотивации, кризисные моменты тяги и срывов.',
    theme: 'theme-start'
  }
};

// =========================================================
// 4. SVG-ИКОНКИ ДЛЯ КАРТОЧЕК НА ГЛАВНОЙ
// =========================================================
const ICONS = {
  meditations: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="7.6"></circle>
    </svg>`,

  lectures: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4.8 6.2c0-.66.54-1.2 1.2-1.2H9.8c1.05 0 2.04.33 2.88.96L13 6.2l.32-.24A4.78 4.78 0 0 1 16.2 5H20c.66 0 1.2.54 1.2 1.2v11.9c0 .5-.4.9-.9.9h-4.1c-1.02 0-2 .3-2.82.88l-.38.26-.38-.26A4.84 4.84 0 0 0 9.8 19H5.7a.9.9 0 0 1-.9-.9V6.2Z"></path>
      <path d="M12.98 6.15V19.6"></path>
    </svg>`,

  practices: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="2.9"></circle>
      <path d="M12 3.2v2.4"></path>
      <path d="M12 18.4v2.4"></path>
      <path d="M20.8 12h-2.4"></path>
      <path d="M5.6 12H3.2"></path>
      <path d="M17.9 6.1 16.3 7.7"></path>
      <path d="M7.7 16.3 6.1 17.9"></path>
      <path d="M17.9 17.9 16.3 16.3"></path>
      <path d="M7.7 7.7 6.1 6.1"></path>
    </svg>`,

  addiction: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M9.15 14.85 7.1 16.9a2.9 2.9 0 0 1-4.1-4.1L5.95 9.85"></path>
      <path d="M14.85 9.15 16.9 7.1a2.9 2.9 0 0 1 4.1 4.1l-2.95 2.95"></path>
      <path d="M9.35 14.65 14.65 9.35"></path>
    </svg>`,

  materials: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M7.1 3.9h6.35l3.45 3.45v12.75a1 1 0 0 1-1 1H7.1a1 1 0 0 1-1-1V4.9a1 1 0 0 1 1-1Z"></path>
      <path d="M13.45 3.9v3.55h3.45"></path>
      <path d="M9.1 12.15h5.8"></path>
      <path d="M9.1 15.2h5.8"></path>
    </svg>`
};

// =========================================================
// 5. УТИЛИТЫ
// =========================================================
function byId(id) {
  return document.getElementById(id);
}

function itemMap() {
  const map = new Map();
  (window.APP_DATA.items || []).forEach(item => {
    map.set(item.id, item);
  });
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

// =========================================================
// 6. ШАБЛОНЫ ОТДЕЛЬНЫХ ССЫЛОК
// =========================================================
function listItem(item) {
  return `
    <a class="path-item" href="${escapeHtml(item.link)}" rel="noopener noreferrer">
      <span class="list-item-title">${escapeHtml(item.title)}</span>
      <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
    </a>
  `;
}

function pathListItem(item) {
  return `
    <a class="path-item" href="${escapeHtml(item.link)}" rel="noopener noreferrer">
      <span class="list-item-title">${escapeHtml(item.title)}</span>
      <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
    </a>
  `;
}

// =========================================================
// 7. КАРТОЧКИ ЭТАПОВ ОСНОВНОГО МАРШРУТА
// =========================================================
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
      </summary>
      <div class="phase-content">
        <div class="path-list">
          ${items}
        </div>
      </div>
    </details>
  `;
}

// =========================================================
// 8. РЕНДЕР ГЛАВНОЙ СТРАНИЦЫ
// =========================================================
function renderHome() {
  const sections = window.APP_DATA.sections || [];
  const hero = sections.find(section => section.id === 'full-path');
  const secondary = sections.filter(section => section.id !== 'full-path');
  const topTiles = secondary.slice(0, 4);
  const bottomTile = secondary[4];

  return `
    <section class="view-shell home-shell">
      <section class="hero-card hero-card-simple clickable fade-up fade-1" data-view="full-path">
        <div class="hero-card-text">
          <h2>${escapeHtml(hero?.title || 'Основной маршрут')}</h2>
          <p>${escapeHtml(hero?.description || '')}</p>
        </div>
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
        </section>
      ` : ''}
    </section>
  `;
}

// =========================================================
// 9. РЕНДЕР ОСНОВНОГО МАРШРУТА
// =========================================================
function renderFullPath() {
  const phases = window.APP_DATA.phases || [];

  const html = phases.map((phase) => {
    if (phase.status === 'planned') {
      return plannedPhaseCard(phase);
    }
    return availablePhaseCard(phase);
  }).join('');

  return `
    <section class="view-shell">
      <section class="phases-stack">
        ${html}
      </section>
    </section>
  `;
}

// =========================================================
// 10. РЕНДЕР ОТДЕЛЬНЫХ РАЗДЕЛОВ
// =========================================================
function renderCurated(viewId) {
  const curated = window.APP_DATA.curated || {};
  const ids = curated[viewId] || [];

  const items = ids
    .map(id => ITEMS.get(id))
    .filter(Boolean)
    .map(listItem)
    .join('');

  return `
    <section class="view-shell">
      <div class="phase-content">
        <div class="path-list fade-up fade-1">
          ${items}
        </div>
      </div>
    </section>
  `;
}

// =========================================================
// 11. ПЛАВНАЯ СМЕНА КОНТЕНТА
// =========================================================
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

// =========================================================
// 12. ГЛАВНЫЙ РЕНДЕРЕР
// =========================================================
function renderView() {
  const root = byId('app');
  const pageTitle = byId('pageTitle');
  const pageSubtitle = byId('pageSubtitle');
  const backBtn = byId('backBtn');
  const meta = VIEW_META[state.activeView] || VIEW_META.home;

  document.body.className = meta.theme;

  if (pageTitle) {
    pageTitle.textContent = meta.title;
    pageTitle.classList.remove('is-letter-title');
  }

  if (pageSubtitle) {
    pageSubtitle.textContent = meta.subtitle;
  }

  if (backBtn) {
    backBtn.hidden = state.activeView === 'home';
  }

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

// =========================================================
// 13. ПЕРЕХОДЫ ПО КАРТОЧКАМ
// =========================================================
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

// =========================================================
// 14. БЕЗОПАСНОЕ ОТКРЫТИЕ ССЫЛОК ИЗ TELEGRAM MINI APP
// =========================================================
function openExternalLink(url) {
  if (!url) return;

  const webApp = window.Telegram?.WebApp;
  const isTelegramLink = /^(https?:\/\/)?(t\.me|telegram\.me)\//i.test(url);

  // Сначала отправляем Telegram команду открыть ссылку,
  // потом сразу закрываем Mini App.
  // Это стабильнее, чем закрывать приложение ДО открытия ссылки.
  if (webApp && isTelegramLink && typeof webApp.openTelegramLink === 'function') {
    webApp.openTelegramLink(url);

    if (typeof webApp.close === 'function') {
      webApp.close();
    }

    return;
  }

  if (webApp && typeof webApp.openLink === 'function') {
    webApp.openLink(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}

// =========================================================
// 15. ЗАПУСК ПРИЛОЖЕНИЯ
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  if (tg) {
    tg.ready();
    tg.expand();

    tg.BackButton.show();

    tg.BackButton.onClick(() => {
      if (state.activeView !== 'home') {
        state.activeView = 'home';
        renderView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        tg.close();
      }
    });
  }

  const backBtn = byId('backBtn');
  const root = byId('app');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.activeView = 'home';
      renderView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (root) {
    root.classList.add('app-fade');
  }

  renderView();
});

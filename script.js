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
      <path d="M12 4.6c2.5 2.4 2.5 6.6 0 10.2-2.5-3.6-2.5-7.8 0-10.2Z"></path>
      <path d="M12 14.8C8.7 14.8 5.4 12.9 4 9.4c3.5-.3 6.6 1.3 8 5.4Z"></path>
      <path d="M12 14.8c3.3 0 6.6-1.9 8-5.4-3.5-.3-6.6 1.3-8 5.4Z"></path>
      <path d="M7.4 18.4c2.8 1.6 6.4 1.6 9.2 0"></path>
    </svg>`,

  lectures: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4.8 6.2c0-.66.54-1.2 1.2-1.2H9.8c1.05 0 2.04.33 2.88.96L13 6.2l.32-.24A4.78 4.78 0 0 1 16.2 5H20c.66 0 1.2.54 1.2 1.2v11.9c0 .5-.4.9-.9.9h-4.1c-1.02 0-2 .3-2.82.88l-.38.26-.38-.26A4.84 4.84 0 0 0 9.8 19H5.7a.9.9 0 0 1-.9-.9V6.2Z"></path>
      <path d="M12.98 6.15V19.6"></path>
    </svg>`,

  practices: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10.48 4.86 L10.71 2.79 L13.29 2.79 L13.52 4.86 A7.3 7.3 0 0 1 15.98 5.88 L17.60 4.57 L19.43 6.40 L18.12 8.02 A7.3 7.3 0 0 1 19.14 10.48 L21.21 10.71 L21.21 13.29 L19.14 13.52 A7.3 7.3 0 0 1 18.12 15.98 L19.43 17.60 L17.60 19.43 L15.98 18.12 A7.3 7.3 0 0 1 13.52 19.14 L13.29 21.21 L10.71 21.21 L10.48 19.14 A7.3 7.3 0 0 1 8.02 18.12 L6.40 19.43 L4.57 17.60 L5.88 15.98 A7.3 7.3 0 0 1 4.86 13.52 L2.79 13.29 L2.79 10.71 L4.86 10.48 A7.3 7.3 0 0 1 5.88 8.02 L4.57 6.40 L6.40 4.57 L8.02 5.88 A7.3 7.3 0 0 1 10.48 4.86Z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`,

  addiction: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
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

const ITEMS = new Map(
  (window.APP_DATA?.items || []).map(item => [item.id, item])
);

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
    .map(listItem)
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

// 14. ОТКРЫТИЕ TELEGRAM-ССЫЛОК
// =========================================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
 
  const href = link.getAttribute('href');
  if (!href || !href.includes('t.me')) return;
 
  e.preventDefault();
 
  const webApp = window.Telegram?.WebApp;
 
  if (webApp) {
    // Открываем ссылку, затем закрываем Mini App —
    // иначе он висит поверх контента
    if (webApp.openTelegramLink) {
      webApp.openTelegramLink(href);
    }
    setTimeout(() => {
      webApp.close();
    }, 300);
  } else {
    window.open(href, '_blank', 'noopener,noreferrer');
  }
});
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

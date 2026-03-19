/* =========================================================
   1. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
   Здесь хранится, какой экран сейчас открыт
   home / full-path / meditations / lectures и т.д.
========================================================= */
const state = {
  activeView: 'home'
};

/* =========================================================
   2. ПОДПИСИ ТИПОВ МАТЕРИАЛОВ
   Эти названия показываются справа у ссылок:
   Лекция / Медитация / Практика / Материал / Размышление
========================================================= */
const TYPE_LABELS = {
  meditation: 'Медитация',
  lecture: 'Лекция',
  practice: 'Практика',
  material: 'Материал',
  podcast: 'Размышление'
};

/* =========================================================
   3. МЕТА-ДАННЫЕ ЭКРАНОВ
   Что показывать в верхнем заголовке страницы:
   - title    = главный заголовок
   - subtitle = подзаголовок
   - theme    = CSS-класс темы страницы
========================================================= */
const VIEW_META = {
  home: {
    title: '',
    subtitle: `Впереди — открытие себя.`,
    theme: 'theme-home'
  },
  'full-path': {
    title: 'Основной маршрут',
    subtitle: 'Последовательный путь через лекции, практики и медитации. Начни смотреть сначала. Проходи этапы в своём темпе и возвращайся к важным моментам.',
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
    subtitle: 'Здесь собрано всё важное для тяги, срыва, восстановления, мотивации и удержания пути.',
    theme: 'theme-start'
  }
};

/* =========================================================
   4. SVG-ИКОНКИ ДЛЯ КАРТОЧЕК НА ГЛАВНОЙ
   Используются у разделов:
   Медитации / Лекции / Практики / Зависимость / Материалы
========================================================= */
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
    
    <!-- внешний круг -->
    <circle cx="12" cy="12" r="7"></circle>
    
    <!-- зубцы (минимальные, через вырезы ощущаются) -->
    <path d="M12 3.5v2"></path>
    <path d="M12 18.5v2"></path>
    <path d="M20.5 12h-2"></path>
    <path d="M5.5 12h-2"></path>
    <path d="M17.3 6.7l-1.4 1.4"></path>
    <path d="M7.1 16.9l-1.4 1.4"></path>
    <path d="M17.3 17.3l-1.4-1.4"></path>
    <path d="M7.1 7.1l-1.4-1.4"></path>

    <!-- центр -->
    <circle cx="12" cy="12" r="2.6"></circle>

  </svg>
`,
   
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

/* =========================================================
   5. УТИЛИТЫ
   Вспомогательные функции
========================================================= */

/* Получить элемент по id */
function byId(id) {
  return document.getElementById(id);
}

/* Собираем Map всех материалов:
   id материала -> объект материала
   Это нужно, чтобы быстро находить материалы по id
*/
function itemMap() {
  const map = new Map();
  (window.APP_DATA.items || []).forEach(item => {
    map.set(item.id, item);
  });
  return map;
}

/* Готовая карта всех материалов */
const ITEMS = itemMap();

/* Защита текста от HTML-вставок */
function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* =========================================================
   6. ШАБЛОНЫ ОТДЕЛЬНЫХ ССЫЛОК
   Это строки внутри списков материалов
========================================================= */

/* Обычный элемент списка для разделов:
   медитации / лекции / практики / материалы
*/
function listItem(item) {
  return `
    <a class="list-item" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
      <span class="list-item-title">${escapeHtml(item.title)}</span>
      <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
    </a>
  `;
}

/* Элемент списка внутри основного маршрута */
function pathListItem(item) {
  return `
    <a class="path-item" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
      <span class="list-item-title">${escapeHtml(item.title)}</span>
      <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
    </a>
  `;
}

/* =========================================================
   7. КАРТОЧКИ ЭТАПОВ ОСНОВНОГО МАРШРУТА
========================================================= */

/* Неживая карточка этапа:
   - не раскрывается
   - не кликается как этап
   - показывает статус "Скоро"
*/
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

/* Живая карточка этапа:
   - раскрывается
   - внутри показывает список материалов этапа
*/
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
        <div class="path-list">${items}</div>
      </div>
    </details>
  `;
}

/* =========================================================
   8. РЕНДЕР ГЛАВНОЙ СТРАНИЦЫ
   Здесь собирается главная:
   - большая карточка "Основной маршрут"
   - сетка вторичных карточек
========================================================= */
function renderHome() {
  const sections = window.APP_DATA.sections || [];

  /* Главная карточка "Основной маршрут" */
  const hero = sections.find(section => section.id === 'full-path');

  /* Остальные карточки */
  const secondary = sections.filter(section => section.id !== 'full-path');

  /* Первые 4 идут в сетку */
  const topTiles = secondary.slice(0, 4);

  /* Пятая идёт широкой карточкой снизу */
  const bottomTile = secondary[4];

  return `
    <section class="view-shell home-shell">

      <!-- Главная карточка -->
      <section class="hero-card hero-card-simple clickable fade-up fade-1" data-view="full-path">
        <div class="hero-card-text">
          <h2>${escapeHtml(hero?.title || 'Основной маршрут')}</h2>
          <p>${escapeHtml(hero?.description || '')}</p>
        </div>
      </section>

      <!-- Верхняя сетка плиток -->
      <section class="secondary-grid fade-up fade-2">
        ${topTiles.map(section => `
          <article class="mini-card clickable" data-view="${escapeHtml(section.id)}">
            <div class="mini-icon">${ICONS[section.id] || ''}</div>
            <div class="mini-title">${escapeHtml(section.title)}</div>
          </article>
        `).join('')}
      </section>

      <!-- Нижняя широкая плитка -->
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

/* =========================================================
   9. РЕНДЕР ОСНОВНОГО МАРШРУТА
   Это экран с этапами пути

   ВАЖНО:
   Здесь исправлена логика:
   - planned берётся из phase.status === 'planned'
   - available = всё остальное доступное
========================================================= */
function renderFullPath() {
  const phases = window.APP_DATA.phases || [];

  const html = phases.map((phase) => {

    /* Если этап помечен как planned — показываем "Скоро" */
    if (phase.status === 'planned') {
      return plannedPhaseCard(phase);
    }

    /* Иначе этап считается живым и раскрываемым */
    return availablePhaseCard(phase);

  }).join('');

  return `
    <section class="view-shell">

      <!-- Вступление к основному маршруту -->

      <!-- Список этапов -->
      <section class="phases-stack">
        ${html}
      </section>

    </section>
  `;
}

/* =========================================================
   10. РЕНДЕР ОТДЕЛЬНЫХ РАЗДЕЛОВ
   Для экранов:
   - meditations
   - lectures
   - practices
   - addiction
   - materials
========================================================= */
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
      <section class="list-wrap fade-up fade-1">
        ${items}
      </section>
    </section>
  `;
}

/* =========================================================
   11. ПЛАВНАЯ СМЕНА КОНТЕНТА
   Меняет содержимое #app и заново навешивает клики
========================================================= */
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

/* =========================================================
   12. ГЛАВНЫЙ РЕНДЕРЕР
   Определяет, какой экран показывать сейчас
========================================================= */
function renderView() {
  const root = byId('app');
  const meta = VIEW_META[state.activeView] || VIEW_META.home;

  /* Меняем тему body */
  document.body.className = meta.theme;

  /* Меняем заголовки наверху */
  byId('pageTitle').textContent = meta.title;
  byId('pageTitle').classList.remove('is-letter-title');
  byId('pageSubtitle').textContent = meta.subtitle;

  /* Кнопка "Назад" скрыта только на главной */
  byId('backBtn').hidden = state.activeView === 'home';

  let html = '';

  /* Главная */
  if (state.activeView === 'home') {
    html = renderHome();

  /* Основной маршрут */
  } else if (state.activeView === 'full-path') {
    html = renderFullPath();

  /* Все остальные разделы */
  } else {
    html = renderCurated(state.activeView);
  }

  animateContentSwap(root, html);
}

/* =========================================================
   13. ПЕРЕХОДЫ ПО КАРТОЧКАМ
   Всё, у чего есть data-view, работает как переход
========================================================= */
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

/* =========================================================
   14. ЗАПУСК ПРИЛОЖЕНИЯ
   Выполняется после загрузки страницы
========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* Название бренда в шапке */
  byId('brandTitle').textContent = window.APP_DATA.brand.title;

  /* Кнопка "Назад" всегда возвращает на главную */
  byId('backBtn').addEventListener('click', () => {
    state.activeView = 'home';
    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Подготавливаем корневой контейнер */
  const root = byId('app');
  root.classList.add('app-fade');

  /* Первый рендер */
  renderView();
});

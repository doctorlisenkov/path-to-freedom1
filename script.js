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
    subtitle: 'Впереди чудесный мир открытия себя.',
    theme: 'theme-home'
  },
  'full-path': {
    title: 'Основной маршрут',
    subtitle: 'Последовательная система лекций, медитаций и практик. Ты проходишь её в своём темпе: от знакомства с собой к освобождению, принятию и пониманию. Не торопись. Возвращайся, если необходимо переслушать.',
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

/* =========================================================
   4. SVG-ИКОНКИ ДЛЯ КАРТОЧЕК НА ГЛАВНОЙ
   Используются у разделов:
   Медитации / Лекции / Практики / Зависимость / Материалы
========================================================= */
const ICONS = {
  meditations: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8"></circle>
    </svg>`,

  lectures: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.5 6.5C4.5 5.67 5.17 5 6 5H10.8C11.67 5 12.5 5.35 13 6C13.5 5.35 14.33 5 15.2 5H20V18.5H15.2C14.25 18.5 13.39 18.84 12.72 19.46L12.5 19.67L12.28 19.46C11.61 18.84 10.75 18.5 9.8 18.5H4.5V6.5Z"></path>
    </svg>`,

  practices: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2"></circle>
      <path d="M12 2.8V5"></path>
      <path d="M12 19V21.2"></path>
      <path d="M21.2 12H19"></path>
      <path d="M5 12H2.8"></path>
      <path d="M18.5 5.5L16.9 7.1"></path>
      <path d="M7.1 16.9L5.5 18.5"></path>
      <path d="M18.5 18.5L16.9 16.9"></path>
      <path d="M7.1 7.1L5.5 5.5"></path>
    </svg>`,

  addiction: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10.2 13.8L7.8 16.2C6.47 17.53 4.33 17.53 3 16.2C1.67 14.87 1.67 12.73 3 11.4L6.4 8"></path>
      <path d="M13.8 10.2L16.2 7.8C17.53 6.47 19.67 6.47 21 7.8C22.33 9.13 22.33 11.27 21 12.6L17.6 16"></path>
      <path d="M9 15L15 9"></path>
    </svg>`,

  materials: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 4.5H13.8L17.5 8.2V19.2C17.5 20.19 16.69 21 15.7 21H8.3C7.31 21 6.5 20.19 6.5 19.2V5.8C6.5 4.81 7.31 4 8.3 4H7Z"></path>
      <path d="M13.5 4.5V8.5H17.5"></path>
      <path d="M9 12H15"></path>
      <path d="M9 15H13.5"></path>
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

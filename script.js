const tg = window.Telegram?.WebApp || null;
const D = window.APP_DATA;
const ITEMS = new Map(D.items.map(i => [i.id, i]));
const SECTIONS = new Map(D.sections.map(s => [s.id, s]));
const TYPES = { meditation: 'медитация', lecture: 'лекция', practice: 'практика', material: 'материал' };

// Короткие пояснения под разделами. Меняй текст здесь.
const NOTES = {
  addiction: 'Если сейчас очень тяжело — позвони близкому человеку или в экстренную службу 112. Эти материалы не заменяют врача.'
};

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => s.toLowerCase().replaceAll('ё', 'е');

// ---------- прогресс ----------
const KEY = 'ptf:seen';
let seen = new Set();
try { seen = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...seen])); } catch {} };

// ---------- данные ----------
const phases = D.phases || [];
const routeIds = phases.filter(p => p.status !== 'planned').flatMap(p => p.items || []).filter(id => ITEMS.has(id));
const nextId = () => routeIds.find(id => !seen.has(id));
const phaseOf = new Map();
phases.forEach(p => (p.items || []).forEach(id => phaseOf.set(id, p)));
const split = t => { const m = /^(Этап \d+)\.\s*(.+)$/.exec(t); return m ? [m[1], m[2].replace(/\.$/, '')] : ['', t.replace(/\.$/, '')]; };

// ---------- шаблоны ----------
const row = (it, sub) => `
  <a class="row${seen.has(it.id) ? ' seen' : ''}" href="${esc(it.link)}" data-id="${it.id}" target="_blank" rel="noopener">
    <span class="t">${esc(it.title)}</span><span class="m">${esc(sub ?? TYPES[it.type] ?? '')}</span>
  </a>`;

function home() {
  const nx = ITEMS.get(nextId());
  const done = routeIds.filter(id => seen.has(id)).length;
  const pct = Math.round(done / (routeIds.length || 1) * 100);
  const secs = D.sections.filter(s => s.id !== 'full-path');
  return `
    <header class="head"><p class="eyebrow">${esc(D.brand.subtitle)}</p><h1>${esc(D.brand.title)}</h1></header>
    <a class="lead glass" href="#full-path">
      <span class="eyebrow">${done ? 'Продолжить' : 'Начать путь'}</span>
      <span class="lead-t">${nx ? esc(nx.title) : 'Путь пройден'}</span>
      <span class="bar"><i style="--p:${pct}%"></i></span>
      <span class="m">${done} из ${routeIds.length}</span>
    </a>
    <nav id="secs" class="grid">${secs.map(s => `
      <a class="tile glass" href="#${esc(s.id)}"><span class="m">${(D.curated[s.id] || []).length}</span><span class="tt">${esc(s.title)}</span></a>`).join('')}
    </nav>
    <div id="res" class="glass" hidden></div>
    <div class="dock glass"><input id="q" type="search" placeholder="Поиск по названию" autocomplete="off" aria-label="Поиск"></div>`;
}

function route() {
  const nx = nextId();
  return phases.map(p => {
    const [e, t] = split(p.title);
    if (p.status === 'planned') return `<div class="soon glass"><span class="eyebrow">${e}</span><span class="pt">${esc(t)}</span><span class="m">скоро</span></div>`;
    const ids = (p.items || []).filter(id => ITEMS.has(id));
    const n = ids.filter(id => seen.has(id)).length;
    return `
      <details class="glass" name="phase"${ids.includes(nx) ? ' open' : ''}>
        <summary><span class="eyebrow">${e}</span><span class="pt">${esc(t)}</span><span class="m"><b>${n}</b> / ${ids.length}</span><span class="bar"><i style="--p:${Math.round(n / (ids.length || 1) * 100)}%"></i></span></summary>
        <p class="pd">${esc(p.description)}</p>
        <div class="list">${ids.map(id => row(ITEMS.get(id))).join('')}</div>
      </details>`;
  }).join('');
}

function section(id) {
  const items = (D.curated[id] || []).map(i => ITEMS.get(i)).filter(Boolean);
  return `<div class="list glass">${items.map(i => row(i)).join('')}</div>${NOTES[id] ? `<p class="note">${esc(NOTES[id])}</p>` : ''}`;
}

function bindSearch() {
  const q = $('q'), res = $('res'), secs = $('secs');
  q.addEventListener('input', () => {
    const s = norm(q.value.trim());
    secs.hidden = !!s; res.hidden = !s;
    if (!s) return;
    const hits = D.items.filter(i => norm(i.title).includes(s)).slice(0, 30);
    res.innerHTML = hits.length
      ? hits.map(i => row(i, split(phaseOf.get(i.id)?.title || '')[1] || TYPES[i.type] || '')).join('')
      : '<p class="empty">Ничего не найдено</p>';
  });
}

// ---------- навигация ----------
const view = () => decodeURIComponent(location.hash.slice(1)) || 'home';

function render() {
  const v = view();
  if (v !== 'home' && !SECTIONS.has(v)) { location.hash = ''; return; }
  const meta = SECTIONS.get(v);
  const root = $('app');

  $('top').hidden = v === 'home' || !!tg;
  if (tg) v === 'home' ? tg.BackButton.hide() : tg.BackButton.show();

  const head = v === 'home' ? '' : `<header class="head"><h1>${esc(meta.title)}</h1><p>${esc(meta.description)}</p></header>`;
  const body = v === 'home' ? home() : v === 'full-path' ? route() : section(v);

  root.classList.remove('in');
  root.innerHTML = head + body;
  requestAnimationFrame(() => root.classList.add('in'));
  window.scrollTo(0, 0);
  if (v === 'home') bindSearch();
}

// Отметка прогресса. Mini App не закрываем — человек возвращается туда, где остановился.
document.addEventListener('click', e => {
  const a = e.target.closest('a.row[data-id]');
  if (!a) return;
  seen.add(+a.dataset.id); save();
  a.classList.add('seen');
  const d = a.closest('details');
  if (d) {
    const k = d.querySelectorAll('.row.seen').length;
    d.querySelector('summary b').textContent = k;
    d.querySelector('.bar i').style.setProperty('--p', Math.round(k / d.querySelectorAll('.row').length * 100) + '%');
  }
  if (tg?.openTelegramLink && a.href.includes('t.me')) { e.preventDefault(); tg.openTelegramLink(a.getAttribute('href')); }
});

// ---------- запуск ----------
const applyTheme = () => {
  document.documentElement.dataset.theme = tg?.colorScheme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
};
applyTheme();
if (tg) {
  tg.ready(); tg.expand();
  tg.onEvent('themeChanged', applyTheme);
  tg.BackButton.onClick(() => { location.hash = ''; });
}
window.addEventListener('hashchange', render);
render();

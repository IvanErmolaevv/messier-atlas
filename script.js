const svg = document.querySelector('#sky-map');
const layers = {
  constellations: document.querySelector('#constellation-layer'),
  stars: document.querySelector('#bright-star-layer'),
  messier: document.querySelector('#messier-layer'),
  markers: document.querySelector('#marker-layer'),
  targets: document.querySelector('#target-layer'),
  minor: document.querySelector('#minor-stars'),
};

const lessonPanel = document.querySelector('#lesson-content');
const toast = document.querySelector('#toast');
const mapHint = document.querySelector('#map-hint');
const mapLabel = document.querySelector('#map-label');
const modeTitle = document.querySelector('#mode-title');
const modeKicker = document.querySelector('#mode-kicker');
const stored = JSON.parse(localStorage.getItem('messier-atlas-progress') || '{}');

const objects = [
  { id: 'M13', name: 'Большое скопление Геркулеса', type: 'шаровое скопление', x: 372, y: 248, constellation: 'Геркулес', code: 'NGC 6205' },
  { id: 'M92', name: 'Шаровое скопление', type: 'шаровое скопление', x: 292, y: 168, constellation: 'Геркулес', code: 'NGC 6341' },
  { id: 'M57', name: 'Кольцевая туманность', type: 'планетарная туманность', x: 548, y: 251, constellation: 'Лира', code: 'NGC 6720' },
  { id: 'M27', name: 'Гантель', type: 'планетарная туманность', x: 746, y: 267, constellation: 'Лисичка', code: 'NGC 6853' },
  { id: 'M15', name: 'Скопление Пегаса', type: 'шаровое скопление', x: 984, y: 206, constellation: 'Пегас', code: 'NGC 7078' },
  { id: 'M11', name: 'Дикая Утка', type: 'рассеянное скопление', x: 704, y: 548, constellation: 'Щит', code: 'NGC 6705' },
  { id: 'M16', name: 'Туманность Орёл', type: 'эмиссионная туманность', x: 573, y: 605, constellation: 'Змея', code: 'NGC 6611' },
  { id: 'M17', name: 'Туманность Омега', type: 'эмиссионная туманность', x: 649, y: 614, constellation: 'Стрелец', code: 'NGC 6618' },
  { id: 'M20', name: 'Трёхраздельная', type: 'эмиссионная туманность', x: 524, y: 668, constellation: 'Стрелец', code: 'NGC 6514' },
  { id: 'M22', name: 'Шаровое скопление', type: 'шаровое скопление', x: 466, y: 623, constellation: 'Стрелец', code: 'NGC 6656' },
  { id: 'M8', name: 'Лагуна', type: 'эмиссионная туманность', x: 410, y: 691, constellation: 'Стрелец', code: 'NGC 6523' },
  { id: 'M39', name: 'Рассеянное скопление', type: 'рассеянное скопление', x: 779, y: 125, constellation: 'Лебедь', code: 'NGC 7092' },
];

const missionIds = ['M13', 'M92', 'M57', 'M27', 'M15', 'M11'];
const mission = missionIds.map((id) => objects.find((object) => object.id === id));

const stars = [
  { name: 'Вега', latin: 'Vega · α Lyr', x: 503, y: 191, r: 6.5 },
  { name: 'Денеб', latin: 'Deneb · α Cyg', x: 798, y: 166, r: 5.2 },
  { name: 'Альтаир', latin: 'Altair · α Aql', x: 736, y: 436, r: 5.3 },
  { name: 'Арктур', latin: 'Arcturus · α Boo', x: 196, y: 289, r: 5.8 },
  { name: 'Антарес', latin: 'Antares · α Sco', x: 309, y: 632, r: 5.8 },
  { name: 'Альферац', latin: 'Alpheratz · α And', x: 1025, y: 169, r: 4.5 },
  { name: 'Рас Альгети', latin: 'α Her', x: 337, y: 329, r: 4.1 },
  { name: 'Садр', latin: 'γ Cyg', x: 729, y: 269, r: 4.1 },
  { name: 'Шелиак', latin: 'β Lyr', x: 555, y: 287, r: 3.4 },
  { name: 'Таразед', latin: 'γ Aql', x: 690, y: 462, r: 3.4 },
];

const constellations = [
  { name: 'ГЕРКУЛЕС', x: 281, y: 142, path: 'M205 244 L264 198 L338 218 L394 289 L337 330 L264 299 L205 244' },
  { name: 'ЛИРА', x: 510, y: 121, path: 'M503 191 L555 287 L519 322 L474 280 L503 191' },
  { name: 'ЛЕБЕДЬ', x: 811, y: 302, path: 'M798 166 L729 269 L777 373 L736 436 M729 269 L654 326 M729 269 L828 338' },
  { name: 'ОРЁЛ', x: 674, y: 495, path: 'M690 462 L736 436 L779 474 M736 436 L725 515' },
  { name: 'ПЕГАС', x: 1001, y: 294, path: 'M1025 169 L1091 243 L1033 315 L963 244 L1025 169' },
  { name: 'СТРЕЛЕЦ', x: 461, y: 584, path: 'M430 548 L466 623 L524 668 L574 626 L533 574 L466 623 M524 668 L410 691' },
  { name: 'СКОРПИОН', x: 252, y: 530, path: 'M309 632 L278 564 L250 498 L227 433 L196 405 M309 632 L271 675 L322 713' },
];

let mode = 'learn';
let selectedObject = null;
let placements = {};
let result = null;
let soundOn = false;
let toastTimer = null;

function svgEl(name, attrs = {}, text = '') {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  if (text) el.textContent = text;
  return el;
}

function renderBackgroundStars() {
  const fixedStars = Array.from({ length: 105 }, (_, index) => {
    const x = (index * 137.50776405) % 1180 + 10;
    const y = (index * 61.80339887) % 720 + 20;
    const r = [0.8, 1, 1.2, 1.4][index % 4];
    return { x, y, r, o: 0.2 + (index % 6) * 0.07 };
  });
  layers.minor.innerHTML = '';
  fixedStars.forEach((star) => layers.minor.append(svgEl('circle', { class: 'minor-star', cx: star.x, cy: star.y, r: star.r, opacity: star.o })));
}

function renderConstellations() {
  layers.constellations.innerHTML = '';
  constellations.forEach((constellation) => {
    layers.constellations.append(svgEl('path', { class: 'constellation-line', d: constellation.path }));
    layers.constellations.append(svgEl('text', { class: 'constellation-label', x: constellation.x, y: constellation.y }, constellation.name));
  });
}

function renderStars() {
  layers.stars.innerHTML = '';
  stars.forEach((star) => {
    const group = svgEl('g', { class: 'named-star' });
    group.append(svgEl('circle', { class: 'bright-star', cx: star.x, cy: star.y, r: star.r + 5, opacity: 0.1 }));
    group.append(svgEl('circle', { class: 'bright-star', cx: star.x, cy: star.y, r: star.r }));
    group.append(svgEl('circle', { class: 'star-core', cx: star.x, cy: star.y, r: Math.max(1.2, star.r / 3) }));
    const labelX = star.x + (star.x > 900 ? -12 : 12);
    const anchor = star.x > 900 ? 'end' : 'start';
    group.append(svgEl('text', { class: 'star-label', x: labelX, y: star.y - 8, 'text-anchor': anchor }, star.name));
    group.append(svgEl('text', { class: 'star-label-sub', x: labelX, y: star.y + 8, 'text-anchor': anchor }, star.latin));
    layers.stars.append(group);
  });
}

function renderMessier() {
  layers.messier.innerHTML = '';
  const show = mode === 'learn' || mode === 'catalog';
  if (!show) return;
  objects.forEach((object) => {
    const group = svgEl('g', { class: 'messier-object', tabindex: '0', role: 'button', 'aria-label': `${object.id}, ${object.name}` });
    group.dataset.objectId = object.id;
    group.append(svgEl('circle', { class: 'object-halo', cx: object.x, cy: object.y, r: 21 }));
    group.append(svgEl('circle', { class: 'object-ring', cx: object.x, cy: object.y, r: 11 }));
    group.append(svgEl('text', { class: 'object-code', x: object.x, y: object.y + 0.5 }, object.id));
    if (mode === 'learn') {
      group.append(svgEl('line', { class: 'object-guide', x1: object.x + 12, y1: object.y + 4, x2: object.x + 31, y2: object.y + 18 }));
      group.append(svgEl('text', { class: 'object-label', x: object.x + 35, y: object.y + 17 }, object.name));
      group.append(svgEl('text', { class: 'object-name', x: object.x + 35, y: object.y + 31 }, `${object.constellation} · ${object.type}`));
    }
    group.addEventListener('mouseenter', () => showObjectTip(object));
    group.addEventListener('mouseleave', hideObjectTip);
    group.addEventListener('focus', () => showObjectTip(object));
    group.addEventListener('blur', hideObjectTip);
    group.addEventListener('click', (event) => { event.stopPropagation(); showObjectInfo(object); });
    layers.messier.append(group);
  });
}

function showObjectTip(object) {
  const tooltip = document.querySelector('#map-tooltip');
  tooltip.setAttribute('visibility', 'visible');
  tooltip.setAttribute('transform', `translate(${Math.min(object.x + 16, 1005)} ${Math.max(object.y - 62, 10)})`);
  tooltip.querySelector('.tooltip-title').textContent = `${object.id} · ${object.name}`;
  tooltip.querySelector('.tooltip-subtitle').textContent = `${object.constellation} · ${object.type}`;
}

function hideObjectTip() { document.querySelector('#map-tooltip').setAttribute('visibility', 'hidden'); }

function renderMarkers() {
  layers.markers.innerHTML = '';
  Object.entries(placements).forEach(([id, point]) => {
    const group = svgEl('g', { class: 'user-marker' });
    group.append(svgEl('circle', { class: 'marker-ring', cx: point.x, cy: point.y, r: 13 }));
    group.append(svgEl('circle', { cx: point.x, cy: point.y, r: 3, fill: '#7ee5e2' }));
    group.append(svgEl('text', { class: 'marker-code', x: point.x, y: point.y + 23 }, id));
    layers.markers.append(group);
  });
}

function renderTargets() {
  layers.targets.innerHTML = '';
  if (mode !== 'train' || !result) return;
  mission.forEach((object) => {
    const placed = placements[object.id];
    const distance = placed ? Math.hypot(placed.x - object.x, placed.y - object.y) : Infinity;
    const target = svgEl('circle', { class: `target-ring${distance < 48 ? ' is-correct' : ''}`, cx: object.x, cy: object.y, r: 24 });
    layers.targets.append(target);
  });
}

function updateLayers() {
  document.querySelector('#constellation-layer').style.display = document.querySelector('#constellation-toggle').checked ? '' : 'none';
  document.querySelector('#bright-star-layer').style.display = document.querySelector('#stars-toggle').checked ? '' : 'none';
  document.querySelector('#messier-layer').style.display = document.querySelector('#guides-toggle').checked ? '' : 'none';
}

function renderLearnPanel() {
  lessonPanel.innerHTML = `
    <h3>Летний треугольник<br />и его сокровища</h3>
    <p>Начните с трёх очень ярких звёзд: Веги, Денеба и Альтаира. Между ними легко найти первые объекты Мессье.</p>
    <div class="focus-object">
      <div class="focus-object__mark">M57</div>
      <div><b>Объект-ориентир</b><small>Кольцевая туманность в Лире</small></div>
    </div>
    <div class="clue-list">
      <div class="clue"><i>1</i><span>Найдите Вегу — самую яркую точку у «маленькой лиры».</span></div>
      <div class="clue"><i>2</i><span>Пройдите к Шелиаку: М57 лежит прямо между ними.</span></div>
      <div class="clue"><i>3</i><span>Повторите маршрут глазами, не читая подписи.</span></div>
    </div>
    <button class="primary-button" id="start-training" type="button">Проверить себя →</button>
  `;
  document.querySelector('#start-training').addEventListener('click', () => setMode('train'));
}

function renderTrainPanel() {
  const placedCount = Object.keys(placements).length;
  const choices = mission.map((object) => `
    <button class="object-choice ${selectedObject === object.id ? 'is-selected' : ''} ${placements[object.id] ? 'is-placed' : ''}" data-choice="${object.id}" type="button">
      <span class="object-choice__code">${object.id}</span><span class="object-choice__name">${object.name}</span>${placements[object.id] ? '<span class="object-choice__tick">✓</span>' : ''}
    </button>`).join('');
  const score = result ? result.score : null;
  lessonPanel.innerHTML = `
    <h3>Расставьте<br />все шесть меток</h3>
    <p>Выберите объект, затем кликните на его предполагаемое место на карте. Подписи Мессье скрыты — оставлены только ориентиры.</p>
    ${score !== null ? `<div class="score-card"><div class="score-card__numbers"><strong>${score}/6</strong><span>${score === 6 ? 'МАРШРУТ ВЫУЧЕН' : 'ЕЩЁ ОДНА ПОПЫТКА'}</span></div><p>${score === 6 ? 'Отлично! Вы уже читаете этот участок неба.' : 'Зелёные окружности показывают точные позиции. Сравните их со своими метками.'}</p></div>` : `<p class="train-note">${selectedObject ? `Выбран ${selectedObject}. Кликните на карту.` : `Выберите объект ниже. Меток: ${placedCount} из 6.`}</p>`}
    <div class="object-list">${choices}</div>
    <button class="primary-button" id="check-answers" type="button" ${placedCount < mission.length ? 'disabled' : ''}>${score !== null ? 'Проверить ещё раз' : 'Проверить позиции'}</button>
    <button class="secondary-button" id="clear-markers" type="button">Сбросить метки</button>
  `;
  lessonPanel.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    selectedObject = button.dataset.choice;
    result = null;
    renderTrainPanel();
    showToast(`Выбран ${selectedObject}. Отметьте его место на небе.`);
  }));
  lessonPanel.querySelector('#check-answers').addEventListener('click', checkAnswers);
  lessonPanel.querySelector('#clear-markers').addEventListener('click', clearMarkers);
}

function renderCatalogPanel() {
  const catalogue = objects.slice(0, 10).map((object) => `<article class="catalog-item"><b>${object.id}</b><span>${object.name}</span><small>${object.type}</small></article>`).join('');
  lessonPanel.innerHTML = `
    <h3>Мессье —<br />живой каталог</h3>
    <p class="catalogue-intro">110 объектов для наблюдателей XVIII века и для нас. Ниже — ориентиры этой карты.</p>
    <div class="catalog-grid">${catalogue}</div>
    <button class="secondary-button" id="back-to-learn" type="button">← Вернуться к уроку</button>
  `;
  document.querySelector('#back-to-learn').addEventListener('click', () => setMode('learn'));
}

function renderPanel() {
  if (mode === 'learn') renderLearnPanel();
  if (mode === 'train') renderTrainPanel();
  if (mode === 'catalog') renderCatalogPanel();
}

function setMode(nextMode) {
  mode = nextMode;
  selectedObject = null;
  result = null;
  const titles = {
    learn: ['Сессия 01 · Северное лето', 'Ориентиры летнего неба', 'Интерактивная карта · северное небо', 'Нажмите на объект, чтобы узнать больше'],
    train: ['Тренировка · Шесть объектов', 'Поставьте метки по памяти', 'Тренировочная карта · подписи скрыты', 'Выберите объект и кликните на карту'],
    catalog: ['Атлас · Избранные объекты', 'Каталог Мессье', 'Карта-атлас · все подсказки', 'Нажмите на объект, чтобы открыть карточку'],
  };
  const [kicker, title, label, hint] = titles[mode];
  modeKicker.textContent = kicker;
  modeTitle.textContent = title;
  mapLabel.textContent = label;
  mapHint.innerHTML = mode === 'train' ? `<kbd>Выберите объект</kbd> и отметьте позицию` : `<kbd>Нажмите</kbd> на объект, чтобы узнать больше`;
  document.querySelectorAll('[data-mode]').forEach((button) => button.classList.toggle('is-active', button.dataset.mode === mode));
  document.querySelector('#guides-toggle').checked = mode !== 'train';
  renderMessier();
  renderMarkers();
  renderTargets();
  renderPanel();
  updateLayers();
}

function showObjectInfo(object) {
  const index = objects.indexOf(object) + 1;
  showToast(`${object.id} — ${object.name}. ${object.type}, созвездие ${object.constellation}.`);
  if (mode === 'learn') {
    document.querySelectorAll('.focus-object__mark').forEach((mark) => { mark.textContent = object.id; });
    const small = document.querySelector('.focus-object small');
    if (small) small.textContent = `${object.name} · ${object.constellation}`;
  }
  return index;
}

function getMapPoint(event) {
  const box = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - box.left) / box.width) * 1200,
    y: ((event.clientY - box.top) / box.height) * 760,
  };
}

function placeMarker(event) {
  if (mode !== 'train') return;
  if (!selectedObject) {
    showToast('Сначала выберите объект справа.');
    return;
  }
  placements[selectedObject] = getMapPoint(event);
  if (soundOn) playTone(460, 0.06);
  selectedObject = null;
  result = null;
  renderMarkers();
  renderTrainPanel();
}

function checkAnswers() {
  if (Object.keys(placements).length !== mission.length) return;
  const correct = mission.filter((object) => Math.hypot(placements[object.id].x - object.x, placements[object.id].y - object.y) < 48);
  result = { score: correct.length };
  if (correct.length > (stored.best || 0)) {
    stored.best = correct.length;
    localStorage.setItem('messier-atlas-progress', JSON.stringify(stored));
  }
  updateProgress();
  renderTargets();
  renderTrainPanel();
  if (soundOn) playTone(correct.length === 6 ? 740 : 320, 0.14);
  showToast(correct.length === 6 ? 'Великолепно! Этот участок неба выучен.' : `Точно: ${correct.length} из 6. Зелёные круги подскажут маршрут.`);
}

function clearMarkers() {
  placements = {};
  selectedObject = null;
  result = null;
  renderMarkers();
  renderTargets();
  renderTrainPanel();
  showToast('Метки очищены. Начнём заново.');
}

function updateProgress() {
  const best = stored.best || 0;
  document.querySelector('#progress-label').textContent = `${best} / 6`;
  document.querySelector('#progress-bar').style.width = `${(best / 6) * 100}%`;
  document.querySelector('#progress-copy').textContent = best === 6 ? 'Летний маршрут освоен ✦' : best ? `Лучший результат: ${best} из 6` : 'Начните с летнего неба';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

function playTone(frequency, duration) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.04, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + duration);
  } catch (_) { /* Sound is a small optional enhancement. */ }
}

document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
svg.addEventListener('click', placeMarker);
document.querySelector('#constellation-toggle').addEventListener('change', updateLayers);
document.querySelector('#stars-toggle').addEventListener('change', updateLayers);
document.querySelector('#guides-toggle').addEventListener('change', updateLayers);
document.querySelector('#reset-map').addEventListener('click', () => {
  hideObjectTip();
  document.querySelector('#constellation-toggle').checked = true;
  document.querySelector('#stars-toggle').checked = true;
  document.querySelector('#guides-toggle').checked = mode !== 'train';
  updateLayers();
  showToast('Слои карты возвращены к исходному виду.');
});
document.querySelector('#sound-button').addEventListener('click', (event) => {
  soundOn = !soundOn;
  event.currentTarget.setAttribute('aria-pressed', String(soundOn));
  event.currentTarget.setAttribute('aria-label', soundOn ? 'Выключить звук' : 'Включить звук');
  showToast(soundOn ? 'Звуковые сигналы включены.' : 'Звуковые сигналы выключены.');
  if (soundOn) playTone(620, 0.07);
});

renderBackgroundStars();
renderConstellations();
renderStars();
updateProgress();
setMode('learn');

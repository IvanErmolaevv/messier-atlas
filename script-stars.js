const DATA_ROOT = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/';
const MODERN_SKY_CULTURE_URL = 'https://raw.githubusercontent.com/Stellarium/stellarium/92b071c6690565fc0fd3faff177e0ac6deb36cdb/skycultures/modern/index.json';
const urls = {
  stars: `${DATA_ROOT}stars.6.json`,
  fallbackLines: `${DATA_ROOT}constellations.lines.json`,
  messier: `${DATA_ROOT}messier.json`,
  names: `${DATA_ROOT}starnames.json`,
  modern: MODERN_SKY_CULTURE_URL,
};

const constellationNames = {
  And: 'Андромеда', Ant: 'Насос', Aps: 'Райская Птица', Aqr: 'Водолей', Aql: 'Орёл', Ara: 'Жертвенник', Ari: 'Овен', Aur: 'Возничий', Boo: 'Волопас', Cae: 'Резец', Cam: 'Жираф', Cnc: 'Рак', CVn: 'Гончие Псы', CMa: 'Большой Пёс', CMi: 'Малый Пёс', Cap: 'Козерог', Car: 'Киль', Cas: 'Кассиопея', Cen: 'Центавр', Cep: 'Цефей', Cet: 'Кит', Cha: 'Хамелеон', Cir: 'Циркуль', Col: 'Голубь', Com: 'Волосы Вероники', CrA: 'Южная Корона', CrB: 'Северная Корона', Crv: 'Ворон', Crt: 'Чаша', Cru: 'Южный Крест', Cyg: 'Лебедь', Del: 'Дельфин', Dor: 'Золотая Рыба', Dra: 'Дракон', Equ: 'Малый Конь', Eri: 'Эридан', For: 'Печь', Gem: 'Близнецы', Gru: 'Журавль', Her: 'Геркулес', Hor: 'Часы', Hya: 'Гидра', Hyi: 'Южная Гидра', Ind: 'Индеец', Lac: 'Ящерица', Leo: 'Лев', LMi: 'Малый Лев', Lep: 'Заяц', Lib: 'Весы', Lup: 'Волк', Lyn: 'Рысь', Lyr: 'Лира', Men: 'Столовая Гора', Mic: 'Микроскоп', Mon: 'Единорог', Mus: 'Муха', Nor: 'Наугольник', Oct: 'Октант', Oph: 'Змееносец', Ori: 'Орион', Pav: 'Павлин', Peg: 'Пегас', Per: 'Персей', Phe: 'Феникс', Pic: 'Живописец', Psc: 'Рыбы', PsA: 'Южная Рыба', Pup: 'Корма', Pyx: 'Компас', Ret: 'Сетка', Sge: 'Стрела', Sgr: 'Стрелец', Sco: 'Скорпион', Scl: 'Скульптор', Sct: 'Щит', Ser: 'Змея', Sex: 'Секстант', Tau: 'Телец', Tel: 'Телескоп', Tri: 'Треугольник', TrA: 'Южный Треугольник', Tuc: 'Тукан', UMa: 'Большая Медведица', UMi: 'Малая Медведица', Vel: 'Паруса', Vir: 'Дева', Vol: 'Летучая Рыба', Vul: 'Лисичка',
};

const typeNames = {
  gc: 'шаровое скопление', oc: 'рассеянное скопление', g: 'галактика', sfr: 'туманность', pn: 'планетарная туманность', snr: 'остаток сверхновой', dn: 'тёмная туманность', en: 'эмиссионная туманность', rn: 'отражательная туманность',
};

const familiarMessier = {
  M1: 'Крабовидная туманность', M6: 'Бабочка', M7: 'Скопление Птолемея', M8: 'Лагуна', M13: 'Большое скопление Геркулеса', M20: 'Трёхраздельная туманность', M27: 'Гантель', M31: 'Галактика Андромеды', M33: 'Галактика Треугольника', M42: 'Туманность Ориона', M45: 'Плеяды', M51: 'Водоворот', M57: 'Кольцевая туманность', M64: 'Чёрный Глаз', M81: 'Галактика Боде', M82: 'Сигара', M101: 'Вертушка', M104: 'Сомбреро',
};

const lessons = [
  { id: 'sagittarius', title: 'Стрелец: туманности Млечного Пути', description: 'Четыре объекта у «чайника» Стрельца. Найдите их по реальным звёздам и фигуре созвездия Modern.', ids: ['M8', 'M20', 'M22', 'M24'], fov: 36 },
  { id: 'hercules', title: 'Геркулес и Лира', description: 'Три классических объекта между Геркулесом и Лирой — хорошая карта для первого маршрута.', ids: ['M13', 'M92', 'M57'], fov: 36 },
  { id: 'arrow', title: 'Стрела и Лисичка', description: 'Компактная летняя область вокруг туманности Гантель и двух скоплений.', ids: ['M27', 'M56', 'M71'], fov: 36 },
  { id: 'auriga', title: 'Возничий и Близнецы', description: 'Серия рассеянных скоплений в одном небольшом зимнем поле.', ids: ['M35', 'M36', 'M37', 'M38'], fov: 36 },
  { id: 'spring', title: 'Весенние галактики', description: 'Галактики в районе Большой Медведицы и Гончих Псов помещаются в одно поле 40°.', ids: ['M51', 'M63', 'M94', 'M101', 'M106'], fov: 40 },
  { id: 'virgo', title: 'Скопление галактик в Деве', description: 'Несколько галактик каталога Мессье в компактном поле Девы.', ids: ['M58', 'M84', 'M86', 'M87', 'M89', 'M90'], fov: 36 },
  { id: 'andromeda', title: 'Андромеда и Треугольник', description: 'Галактика Андромеды с её спутниками и галактика Треугольника.', ids: ['M31', 'M32', 'M33', 'M110'], fov: 36 },
  { id: 'scorpius', title: 'Скорпион: яркие скопления', description: 'Четыре объекта рядом с изгибом Скорпиона — все в одной реальной области неба.', ids: ['M4', 'M6', 'M7', 'M80'], fov: 38 },
];

const starLessonTemplates = [
  { id: 'ori', title: 'Созвездие Ориона', hips: [24436, 27989, 25336, 26311, 26727, 25930], fov: 36 },
  { id: 'ursa-major', title: 'Большой Ковш', hips: [54061, 53910, 58001, 59774, 62956, 65378], fov: 38 },
  { id: 'sco', title: 'Созвездие Скорпиона', hips: [80763, 78401, 78820, 80112, 85927, 86228], fov: 40 },
  { id: 'sgr', title: 'Созвездие Стрельца', hips: [90185, 92855, 93506, 89931, 90496, 88635], fov: 36 },
  { id: 'cma', title: 'Большой Пёс и Сириус', hips: [32349, 33579, 34444, 30324, 35904], fov: 34 },
  { id: 'gem', title: 'Созвездие Близнецов', hips: [37826, 36850, 31681, 30343, 32246], fov: 36 },
  { id: 'aur', title: 'Созвездие Возничего', hips: [24608, 28360, 28380, 23015, 23416], fov: 34 },
  { id: 'cas', title: 'W Кассиопеи', hips: [4427, 3179, 746, 6686, 8886], fov: 34 },
  { id: 'cyg', title: 'Северный Крест Лебедя', hips: [102098, 100453, 102488, 97165, 95947], fov: 38 },
  { id: 'leo', title: 'Созвездие Льва', hips: [49669, 50583, 57632, 54872, 47908], fov: 40 },
  { id: 'cru', title: 'Южный Крест', hips: [60718, 62434, 61084, 59747], fov: 32 },
  { id: 'aql', title: 'Орёл и Альтаир', hips: [97649, 97278, 93747, 95501], fov: 34 },
  { id: 'per', title: 'Созвездие Персея', hips: [15863, 14576, 18246, 14354], fov: 36 },
  { id: 'tau', title: 'Созвездие Тельца', hips: [21421, 25428, 17702, 26451], fov: 38 },
  { id: 'dra', title: 'Голова Дракона', hips: [87833, 80331, 85670, 94376, 83895], fov: 36 },
  { id: 'vir', title: 'Созвездие Девы', hips: [65474, 61941, 63608, 66249, 63090], fov: 38 },
  { id: 'boo', title: 'Волопас и Арктур', hips: [69673, 72105, 67927, 71075], fov: 36 },
  { id: 'crv', title: 'Созвездие Ворона', hips: [59803, 61359, 60965, 59316], fov: 32 },
  { id: 'lib', title: 'Созвездие Весов', hips: [74785, 72622, 73714], fov: 34 },
  { id: 'umi', title: 'Малая Медведица', hips: [11767, 72607, 75097], fov: 38 },
  { id: 'and', title: 'Созвездие Андромеды', hips: [677, 5447, 9640], fov: 38 },
  { id: 'cep', title: 'Созвездие Цефея', hips: [105199, 116727, 106032], fov: 36 },
  { id: 'aqr', title: 'Созвездие Водолея', hips: [106278, 109074, 113136], fov: 36 },
  { id: 'cen', title: 'Центавр: Ригиль и Хадар', hips: [71683, 68702, 68933, 61932], fov: 38 },
];

const homeCanvas = document.querySelector('#home-canvas');
const atlasCanvas = document.querySelector('#atlas-canvas');
const mapStage = document.querySelector('.map-stage');
const missionPanel = document.querySelector('#mission-panel');
const mapLoading = document.querySelector('#map-loading');
const toast = document.querySelector('#toast');
const controls = {
  figures: document.querySelector('#figures-toggle'),
  names: document.querySelector('#names-toggle'),
  grid: document.querySelector('#grid-toggle'),
  objects: document.querySelector('#objects-toggle'),
};

const sky = {
  ready: false,
  stars: [],
  lines: [],
  messier: [],
  names: {},
  modernNames: {},
  modernLoaded: false,
  popularStars: [],
  starLessons: [],
};

let mode = 'learn';
let field = { center: [-109.3, 36.5], focusId: 'M13', fov: 36, lesson: null, starLesson: null };
let currentTarget = null;
let learnPhase = 'study';
let placedMarkers = {};
let learnResults = {};
let practiceResult = null;
let score = 0;
let streak = 0;
let toastTimer;
let dragState = null;
let suppressClick = false;

const radians = (degreesValue) => degreesValue * Math.PI / 180;
const degrees = (radiansValue) => radiansValue * 180 / Math.PI;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrapLon = (lon) => ((lon + 180) % 360 + 360) % 360 - 180;
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const PANORAMA_FOV_MIN = 22;
const PANORAMA_FOV_MAX = 180;
const isStarLearn = () => mode === 'starLearn';
const isLearningMode = () => mode === 'learn' || mode === 'starLearn';
const isPanoramaMode = () => mode === 'catalog' || mode === 'practice';
const objectById = (id) => sky.messier.find((object) => object.id === id);
const currentObject = () => objectById(field.focusId);
const objectName = (object) => familiarMessier[object.id] || object.properties.alt || object.properties.desig || 'объект каталога';
const objectType = (object) => typeNames[object.properties.type] || 'объект глубокого неба';
const currentLesson = () => isStarLearn() ? field.starLesson : field.lesson;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function coordinatesOf(item) {
  return item?.coordinates || item?.geometry?.coordinates || null;
}

function setView(name) {
  ['home', 'tour', 'atlas'].forEach((view) => {
    const element = document.querySelector(`#${view}-view`);
    element.hidden = view !== name;
    element.classList.toggle('is-active', view === name);
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
  requestAnimationFrame(renderAll);
}

function project(coordinates, center, radius, cx, cy, fov = 180) {
  const [lon, lat] = coordinates;
  const [lon0, lat0] = center;
  const lambda = radians(lon);
  const phi = radians(lat);
  const lambda0 = radians(lon0);
  const phi0 = radians(lat0);
  const delta = lambda - lambda0;
  const cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(delta);
  const half = radians(fov / 2);
  if (cosc < Math.cos(half)) return null;
  const scale = radius / Math.sin(half);
  return {
    x: cx - scale * Math.cos(phi) * Math.sin(delta),
    y: cy - scale * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(delta)),
    cosc,
  };
}

function inverseProject(x, y, center, radius, fov = 180) {
  const half = radians(fov / 2);
  const rho = Math.hypot(x, y) / radius * Math.sin(half);
  if (rho > Math.sin(half)) return null;
  const [lon0, lat0] = center;
  const phi0 = radians(lat0);
  const lambda0 = radians(lon0);
  const c = Math.asin(rho);
  if (rho === 0) return center;
  const north = -y / radius * Math.sin(half);
  const phi = Math.asin(Math.cos(c) * Math.sin(phi0) + north * Math.sin(c) * Math.cos(phi0) / rho);
  const lambda = lambda0 + Math.atan2(-(x / radius) * Math.sin(half) * Math.sin(c), rho * Math.cos(phi0) * Math.cos(c) - north * Math.sin(phi0) * Math.cos(c));
  return [wrapLon(degrees(lambda)), degrees(phi)];
}

function sphericalDistance(a, b) {
  const [a1, a2] = a.map(radians);
  const [b1, b2] = b.map(radians);
  return degrees(Math.acos(clamp(Math.sin(a2) * Math.sin(b2) + Math.cos(a2) * Math.cos(b2) * Math.cos(a1 - b1), -1, 1)));
}

function zoomScaleText() {
  const scale = PANORAMA_FOV_MAX / field.fov;
  const formatted = scale.toFixed(scale < 3 ? 1 : 0).replace('.0', '');
  return `×${formatted}`;
}

function setPanoramaFov(nextFov) {
  if (!isPanoramaMode()) return;
  const fov = clamp(nextFov, PANORAMA_FOV_MIN, PANORAMA_FOV_MAX);
  if (Math.abs(fov - field.fov) < 0.01) return;
  field = { ...field, fov };
  renderAtlas();
}

function circlePath(ctx, points, center, radius, fov) {
  let drawing = false;
  ctx.beginPath();
  points.forEach((coordinates) => {
    const point = project(coordinates, center, radius, 0, 0, fov);
    if (!point) {
      drawing = false;
      return;
    }
    if (!drawing) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
    drawing = true;
  });
  ctx.stroke();
}

function starColor(bv) {
  if (bv === undefined || bv === null) return '#6e83a3';
  if (bv < 0.1) return '#4777c5';
  if (bv < 0.6) return '#536b8d';
  if (bv < 1.15) return '#8d7b5a';
  return '#9a6932';
}

function starRadius(magnitude, fov) {
  return clamp((4.4 - (magnitude + 1.2) * 0.57) * (fov < 60 ? 1.18 : 1), 0.52, 5.4);
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function starNameForHip(hip) {
  const metadata = sky.names[String(hip)] || {};
  const aliases = sky.modernNames[`HIP ${hip}`] || [];
  const modern = aliases.find((alias) => alias.english || alias.native);
  return metadata.ru?.trim() || modern?.native?.trim() || modern?.english?.trim() || metadata.name?.trim() || null;
}

function drawGrid(ctx, center, radius, cx, cy, fov) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(127,155,210,.22)';
  ctx.lineWidth = 0.65;
  const step = fov <= 50 ? 5 : 30;
  for (let dec = -85; dec <= 85; dec += step) {
    const coordinates = [];
    for (let lon = -180; lon <= 180; lon += 1.5) coordinates.push([lon, dec]);
    circlePath(ctx, coordinates, center, radius, fov);
  }
  for (let lon = -180; lon < 180; lon += step) {
    const coordinates = [];
    for (let dec = -89; dec <= 89; dec += 1.5) coordinates.push([lon, dec]);
    circlePath(ctx, coordinates, center, radius, fov);
  }
  ctx.restore();
}

function drawConstellations(ctx, center, radius, cx, cy, showLabels, fov) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(38,84,150,.72)';
  ctx.lineWidth = fov <= 50 ? 1.25 : 1.05;
  ctx.lineCap = 'round';
  const labelCandidates = [];
  sky.lines.forEach((feature) => {
    const groups = feature.geometry.coordinates;
    groups.forEach((line) => circlePath(ctx, line, center, radius, fov));
    const projected = groups.flat().map((coordinates) => project(coordinates, center, radius, 0, 0, fov)).filter(Boolean);
    if (showLabels && feature.properties.rank === '1' && projected.length > 3) {
      const x = projected.reduce((sum, point) => sum + point.x, 0) / projected.length;
      const y = projected.reduce((sum, point) => sum + point.y, 0) / projected.length;
      if (Math.hypot(x, y) < radius * 0.84) labelCandidates.push({ x, y, name: constellationNames[feature.id] || feature.id });
    }
  });
  if (showLabels) {
    ctx.font = `700 ${fov <= 50 ? 11 : 9}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(37,76,135,.64)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const used = [];
    const space = fov <= 50 ? 76 : 54;
    const limit = fov <= 50 ? 32 : 18;
    labelCandidates.sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y)).forEach((label) => {
      if (used.length >= limit || used.some((point) => Math.hypot(point.x - label.x, point.y - label.y) < space)) return;
      used.push(label);
      ctx.fillText(label.name, label.x, label.y);
    });
  }
  ctx.restore();
}

function drawStars(ctx, center, radius, cx, cy, showNames, fov) {
  ctx.save();
  ctx.translate(cx, cy);
  const named = [];
  sky.stars.forEach((star) => {
    const point = project(star.geometry.coordinates, center, radius, 0, 0, fov);
    if (!point) return;
    const magnitude = star.properties.mag;
    const starSize = starRadius(magnitude, fov);
    ctx.beginPath();
    ctx.globalAlpha = clamp(0.42 + (6 - magnitude) * 0.16, 0.4, 1);
    ctx.fillStyle = starColor(star.properties.bv);
    ctx.arc(point.x, point.y, starSize, 0, Math.PI * 2);
    ctx.fill();
    if (showNames && magnitude < 1.75) {
      const name = starNameForHip(star.id);
      if (name) named.push({ x: point.x, y: point.y, name, magnitude });
    }
  });
  if (showNames) {
    ctx.globalAlpha = 1;
    ctx.font = `700 ${fov <= 50 ? 11 : 10}px Inter, sans-serif`;
    ctx.textBaseline = 'middle';
    const used = [];
    const space = fov <= 50 ? 62 : 48;
    named.sort((a, b) => a.magnitude - b.magnitude).forEach((star) => {
      const label = { x: star.x + 9, y: star.y - 8 };
      if (used.some((point) => Math.hypot(point.x - label.x, point.y - label.y) < space)) return;
      used.push(label);
      ctx.fillStyle = 'rgba(26,47,91,.9)';
      ctx.fillText(star.name, label.x, label.y);
    });
  }
  ctx.restore();
}

function visibleObjects(center = field.center, fov = field.fov) {
  return sky.messier.map((object) => ({ object, point: project(object.geometry.coordinates, center, 1, 0, 0, fov) })).filter(({ point }) => point);
}

function displayedObjects(center = field.center, fov = field.fov) {
  const objects = visibleObjects(center, fov);
  return mode === 'learn' && field.lesson ? objects.filter(({ object }) => field.lesson.ids.includes(object.id)) : objects;
}

function drawMessier(ctx, center, radius, cx, cy, showLabels, fov) {
  const objects = displayedObjects(center, fov);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.font = `800 ${fov <= 50 ? 11 : 9}px Inter, sans-serif`;
  ctx.textBaseline = 'middle';
  objects.forEach(({ object, point }) => {
    const x = point.x * radius;
    const y = point.y * radius;
    ctx.beginPath();
    ctx.fillStyle = '#ed625f';
    ctx.globalAlpha = 0.16;
    ctx.arc(x, y, fov <= 50 ? 10 : 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#e65755';
    ctx.arc(x, y, fov <= 50 ? 4 : 3.1, 0, Math.PI * 2);
    ctx.fill();
    if (showLabels) {
      ctx.fillStyle = '#b4474e';
      ctx.fillText(object.id, x + 8, y - 7);
    }
  });
  ctx.restore();
}

function drawLessonStars(ctx, center, radius, cx, cy, fov) {
  if (!isStarLearn() || learnPhase !== 'study') return;
  const labels = [];
  ctx.save();
  ctx.translate(cx, cy);
  lessonTargets().forEach((star) => {
    const point = project(star.coordinates, center, radius, 0, 0, fov);
    if (!point) return;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(117,87,217,.16)';
    ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = '#7557d9';
    ctx.lineWidth = 2;
    ctx.arc(point.x, point.y, 6.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#7557d9';
    ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    labels.push({ x: point.x + 10, y: point.y - 9, name: star.label, magnitude: star.magnitude });
  });
  ctx.font = '800 11px Inter, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#5b43b8';
  const used = [];
  labels.sort((a, b) => a.magnitude - b.magnitude).forEach((label) => {
    if (used.some((point) => Math.hypot(point.x - label.x, point.y - label.y) < 56)) return;
    used.push(label);
    ctx.fillText(label.name, label.x, label.y);
  });
  ctx.restore();
}

function targetFromMessier(object) {
  if (!object) return null;
  return {
    key: object.id,
    label: object.id,
    title: objectName(object),
    detail: objectType(object),
    magnitude: Number(object.properties.mag),
    coordinates: object.geometry.coordinates,
    kind: 'messier',
  };
}

function lessonTargets() {
  if (mode === 'learn') {
    return (field.lesson?.ids || []).map(objectById).filter(Boolean).map(targetFromMessier);
  }
  if (isStarLearn()) return field.starLesson?.stars || [];
  return [];
}

function activeMarkerTarget(id) {
  if (mode === 'practice' && currentTarget?.id === id) return targetFromMessier(currentTarget);
  return lessonTargets().find((target) => target.key === id) || null;
}

function targetLabel(id) {
  return activeMarkerTarget(id)?.label || id;
}

function placementIds() {
  if (mode === 'practice') return currentTarget ? [currentTarget.id] : [];
  if (isLearningMode() && learnPhase !== 'study') return lessonTargets().map((target) => target.key);
  return [];
}

function drawPlacedMarkers(ctx, center, radius, cx, cy, fov) {
  const ids = placementIds();
  if (!ids.length) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.font = `800 ${fov <= 50 ? 11 : 10}px Inter, sans-serif`;
  ctx.textBaseline = 'middle';
  ids.forEach((id) => {
    const coordinates = placedMarkers[id];
    if (!coordinates) return;
    const point = project(coordinates, center, radius, 0, 0, fov);
    if (!point) return;
    const result = isLearningMode() ? learnResults[id] : practiceResult?.correct ? { correct: true } : null;
    const color = result ? result.correct ? '#35a97a' : '#e85f5c' : '#1d68e8';
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(targetLabel(id), point.x + 11, point.y - 9);
  });
  if (mode === 'practice' && practiceResult && currentTarget) {
    const point = project(currentTarget.geometry.coordinates, center, radius, 0, 0, fov);
    if (point) {
      ctx.strokeStyle = practiceResult.correct ? '#35a97a' : '#e85f5c';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
}

function drawSky(canvas, center, options = {}) {
  const sized = resizeCanvas(canvas);
  if (!sized) return null;
  const { ctx, width, height } = sized;
  const fov = options.fov ?? 180;
  const radius = Math.min(width, height) * 0.462;
  const cx = width / 2;
  const cy = height / 2;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#fcfdff';
  ctx.fillRect(0, 0, width, height);
  ctx.translate(cx, cy);
  if (options.grid) drawGrid(ctx, center, radius, 0, 0, fov);
  drawStars(ctx, center, radius, 0, 0, options.starNames, fov);
  if (options.figures) drawConstellations(ctx, center, radius, 0, 0, options.constellationNames, fov);
  if (options.objects) drawMessier(ctx, center, radius, 0, 0, options.objectLabels, fov);
  if (options.lessonStars) drawLessonStars(ctx, center, radius, 0, 0, fov);
  drawPlacedMarkers(ctx, center, radius, 0, 0, fov);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#233b6f';
  ctx.lineWidth = 1.35;
  ctx.stroke();
  return { radius, cx, cy, width, height, fov };
}

function formatCoordinates([lon, lat]) {
  const hours = ((lon + 360) % 360) / 15;
  const hour = Math.floor(hours);
  const minute = Math.round((hours - hour) * 60);
  return `ЦЕНТР: RA ${String(hour).padStart(2, '0')}h ${String(minute).padStart(2, '0')}m · DEC ${lat >= 0 ? '+' : ''}${lat.toFixed(0)}°`;
}

function averageCenter(items) {
  let x = 0;
  let y = 0;
  let z = 0;
  let total = 0;
  items.forEach((item) => {
    const coordinates = coordinatesOf(item);
    if (!coordinates) return;
    const [lon, lat] = coordinates;
    const lambda = radians(lon);
    const phi = radians(lat);
    x += Math.cos(phi) * Math.cos(lambda);
    y += Math.cos(phi) * Math.sin(lambda);
    z += Math.sin(phi);
    total += 1;
  });
  if (!total) return [0, 0];
  const lambda = Math.atan2(y / total, x / total);
  const phi = Math.atan2(z / total, Math.hypot(x / total, y / total));
  return [wrapLon(degrees(lambda)), degrees(phi)];
}

function estimateStarFov(stars, center) {
  const maxDistance = Math.max(0, ...stars.map((star) => sphericalDistance(star.coordinates, center)));
  return clamp(Math.ceil((maxDistance * 2 + 7) / 2) * 2, 32, 40);
}

function makeStarLesson(id, title, stars, fov, featured = false) {
  const center = averageCenter(stars);
  const constellationIds = [...new Set(stars.map((star) => star.constellation).filter(Boolean))];
  const constellations = constellationIds.map((idValue) => constellationNames[idValue] || idValue).join(' · ');
  const labels = stars.map((star) => star.label).join(' · ');
  return {
    id,
    title,
    stars,
    center,
    fov: clamp(Math.max(fov || 0, estimateStarFov(stars, center)), 32, 40),
    featured,
    description: `${labels}. ${constellations ? `Ориентиры: ${constellations}.` : 'Реальные координаты J2000.'}`,
  };
}

function buildStarLessons() {
  const byHip = new Map(sky.popularStars.map((star) => [star.hip, star]));
  const used = new Set();
  const result = [];
  starLessonTemplates.forEach((template) => {
    const stars = template.hips.map((hip) => byHip.get(String(hip))).filter(Boolean).filter((star) => !used.has(star.key));
    if (stars.length < 2) return;
    stars.forEach((star) => used.add(star.key));
    result.push(makeStarLesson(`featured-${template.id}`, template.title, stars, template.fov, true));
  });

  let remaining = sky.popularStars.filter((star) => !used.has(star.key));
  let sequence = 1;
  while (remaining.length) {
    const anchor = remaining.shift();
    const nearby = remaining
      .map((star) => ({ star, distance: sphericalDistance(anchor.coordinates, star.coordinates) }))
      .filter(({ distance }) => distance <= 15.5)
      .sort((a, b) => a.distance - b.distance || a.star.magnitude - b.star.magnitude);
    const stars = [anchor];
    nearby.forEach(({ star }) => {
      if (stars.length >= 5) return;
      const candidate = [...stars, star];
      const center = averageCenter(candidate);
      const spread = Math.max(...candidate.map((item) => sphericalDistance(item.coordinates, center)));
      if (spread <= 16) stars.push(star);
    });
    const selected = new Set(stars.map((star) => star.key));
    remaining = remaining.filter((star) => !selected.has(star.key));
    const constellationIds = [...new Set(stars.map((star) => star.constellation).filter(Boolean))];
    const title = constellationIds.length === 1
      ? `Созвездие ${constellationNames[constellationIds[0]] || constellationIds[0]}`
      : `Окрестности ${anchor.label}`;
    result.push(makeStarLesson(`field-${sequence}`, title, stars, null, false));
    sequence += 1;
  }
  return result.map((lesson, index) => ({ ...lesson, number: index + 1 }));
}

function chooseLesson() {
  if (!sky.ready) return;
  let lesson = lessons[Math.floor(Math.random() * lessons.length)];
  if (field.lesson && lessons.length > 1) {
    while (lesson.id === field.lesson.id) lesson = lessons[Math.floor(Math.random() * lessons.length)];
  }
  const objects = lesson.ids.map(objectById).filter(Boolean);
  field = { center: averageCenter(objects), focusId: objects[0]?.id || 'M13', fov: lesson.fov, lesson, starLesson: null };
  currentTarget = null;
  learnPhase = 'study';
  placedMarkers = {};
  learnResults = {};
  practiceResult = null;
}

function chooseStarLesson() {
  if (!sky.ready || !sky.starLessons.length) return;
  const previous = field.starLesson?.id;
  const featured = sky.starLessons.filter((lesson) => lesson.featured);
  const pool = previous ? sky.starLessons : featured.length ? featured : sky.starLessons;
  let lesson = pool[Math.floor(Math.random() * pool.length)];
  if (previous && pool.length > 1) {
    while (lesson.id === previous) lesson = pool[Math.floor(Math.random() * pool.length)];
  }
  field = { center: [...lesson.center], focusId: lesson.stars[0]?.key || 'star:32349', fov: lesson.fov, lesson: null, starLesson: lesson };
  currentTarget = null;
  learnPhase = 'study';
  placedMarkers = {};
  learnResults = {};
  practiceResult = null;
}

function choosePracticeField() {
  if (!sky.ready) return;
  let target = sky.messier[Math.floor(Math.random() * sky.messier.length)];
  if (currentTarget && sky.messier.length > 1) {
    while (target.id === currentTarget.id) target = sky.messier[Math.floor(Math.random() * sky.messier.length)];
  }
  const [lon, lat] = target.geometry.coordinates;
  field = { center: [wrapLon(lon + randomBetween(-24, 24)), clamp(lat + randomBetween(-16, 16), -72, 72)], focusId: target.id, fov: 180, lesson: null, starLesson: null };
  currentTarget = target;
  placedMarkers = {};
  learnResults = {};
  practiceResult = null;
}

function chooseCatalogField() {
  if (!sky.ready) return;
  field = { center: [-97, 31], focusId: 'M13', fov: 180, lesson: null, starLesson: null };
  currentTarget = null;
  placedMarkers = {};
  learnResults = {};
  practiceResult = null;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3300);
}

function markerResult(id) {
  if (isLearningMode()) return learnResults[id] || null;
  return practiceResult?.correct ? { correct: true } : null;
}

function tokenStyle(target) {
  const result = markerResult(target.key);
  const color = result ? result.correct ? '#35a97a' : '#e85f5c' : '#1d68e8';
  const status = placedMarkers[target.key]
    ? result ? result.correct ? '✓ верно' : 'передвиньте' : 'на карте'
    : 'перетащите на карту';
  return `<button class="panel-subbutton" data-marker-token data-marker-id="${escapeHtml(target.key)}" type="button" style="margin-top:7px;border-color:${color};color:${color};display:flex;justify-content:space-between;align-items:center"><b>${escapeHtml(target.label)}</b><span>${status}</span></button>`;
}

function markerTray(targets, label = 'МЕТКИ ДЛЯ ПЕРЕНОСА') {
  return `<div class="field-card"><span class="field-card__label">${label}</span><small style="margin-top:7px">Перетащите каждую метку на нужное место карты. Метки закрепляются за небесными координатами и вращаются вместе с небом.</small>${targets.map(tokenStyle).join('')}</div>`;
}

function startLessonCheck() {
  if (!currentLesson()) return;
  learnPhase = 'quiz';
  placedMarkers = {};
  learnResults = {};
  renderAtlas();
  showToast('Перетащите все метки из боковой панели на карту.');
}

function setPlacedMarker(id, coordinates) {
  placedMarkers = { ...placedMarkers, [id]: coordinates };
  if (isLearningMode()) learnResults = {};
  if (mode === 'practice') practiceResult = null;
}

function checkLesson() {
  const targets = lessonTargets();
  const missing = targets.filter((target) => !placedMarkers[target.key]);
  if (missing.length) {
    showToast(`Сначала расставьте все метки: осталось ${missing.map((target) => target.label).join(', ')}.`);
    return;
  }
  const results = {};
  targets.forEach((target) => {
    const distance = sphericalDistance(placedMarkers[target.key], target.coordinates);
    results[target.key] = { distance, correct: distance <= 2.5 };
  });
  learnResults = results;
  const correct = targets.every((target) => results[target.key].correct);
  learnPhase = correct ? 'passed' : 'quiz';
  renderAtlas();
  const noun = isStarLearn() ? 'звёзды' : 'объекты';
  showToast(correct ? `Участок пройден — все ${noun} расставлены верно!` : 'Пока не все метки точны. Передвиньте красные метки и проверьте снова.');
}

function checkPractice() {
  const id = currentTarget?.id;
  if (!id || !placedMarkers[id]) {
    showToast('Сначала перетащите метку цели на карту.');
    return;
  }
  const distance = sphericalDistance(placedMarkers[id], currentTarget.geometry.coordinates);
  practiceResult = { correct: distance <= 2.5, distance };
  if (practiceResult.correct) {
    score += 1;
    streak += 1;
    showToast(`Верно: ${id} найден с точностью ${distance.toFixed(1)}°.`);
  } else {
    streak = 0;
    showToast(`Позиция ${id} показана кольцом. Ошибка: ${distance.toFixed(1)}°.`);
  }
  renderAtlas();
}

function renderMessierList(objects) {
  return `<div class="object-list">${objects.map((object) => `<div class="object-list__item"><span class="object-list__id">${escapeHtml(object.id)}</span><span><b class="object-list__name">${escapeHtml(objectName(object))}</b><small class="object-list__type">${escapeHtml(objectType(object))}</small></span><span class="object-list__mag">${Number(object.properties.mag).toFixed(1)}m</span></div>`).join('')}</div>`;
}

function renderStarList(stars) {
  return `<div class="object-list">${stars.map((star) => `<div class="object-list__item"><span class="object-list__id" style="color:#7557d9">★</span><span><b class="object-list__name">${escapeHtml(star.label)}</b><small class="object-list__type">${escapeHtml(star.englishName)} · ${escapeHtml(constellationNames[star.constellation] || star.constellation || 'небесная сфера')}</small></span><span class="object-list__mag">${star.magnitude.toFixed(1)}m</span></div>`).join('')}</div>`;
}

function renderCatalogPanel() {
  const focus = currentObject();
  if (!focus) return;
  const visible = visibleObjects().map(({ object }) => object).sort((a, b) => a.properties.mag - b.properties.mag);
  missionPanel.innerHTML = `<p class="panel-kicker">КАТАЛОГ · КАРТА 360°</p><h2>Вращайте<br />небесную сферу</h2><p class="panel-text">Карта обзора 360° с отмеченными объектами Мессье и линиями созвездий Modern. Тяните карту для поворота, а колесо или кнопки +/− помогут приблизить нужный участок.</p><div class="field-card"><span class="field-card__label">ТЕКУЩИЙ ОРИЕНТИР</span><strong>${focus.id}</strong><small>${escapeHtml(objectName(focus))} · ${escapeHtml(objectType(focus))}</small></div>${renderMessierList(visible.slice(0, 8))}<button class="button panel-button" data-action="new-map" type="button">Вернуть обзор 360° <span>↺</span></button><button class="panel-subbutton" data-action="start-learn" type="button">Вернуться к урокам 36°</button>`;
}

function renderLearningPanel() {
  const lesson = currentLesson();
  const targets = lessonTargets();
  if (!lesson || !targets.length) return;
  const starsMode = isStarLearn();
  const countLabel = starsMode ? 'ЗВЁЗД НА КАРТЕ' : 'ОБЪЕКТОВ НА КАРТЕ';
  const list = starsMode ? renderStarList(targets) : renderMessierList(targets.map((target) => objectById(target.key)).filter(Boolean));
  const intro = starsMode
    ? 'Сначала изучите собственные имена и реальные позиции звёзд. Затем начните проверку и расставьте все метки самостоятельно.'
    : 'Сначала изучите реальные позиции объектов и звёздные ориентиры. Затем начните проверку и расставьте все метки самостоятельно.';
  if (learnPhase === 'study') {
    const subtext = starsMode
      ? `Маршрут ${lesson.number} из ${sky.starLessons.length}. Курс охватывает ${sky.popularStars.length} ярких звёзд с собственными именами.`
      : lesson.description;
    missionPanel.innerHTML = `<p class="panel-kicker">${starsMode ? 'ЗВЁЗДЫ · TOP-200' : 'ОБУЧЕНИЕ'} · ПОЛЕ ${field.fov}°</p><h2>${escapeHtml(lesson.title)}</h2><p class="panel-text">${intro}</p><div class="field-card"><span class="field-card__label">${countLabel}</span><strong>${targets.length}</strong><small>${escapeHtml(subtext)}</small></div>${list}<button class="button panel-button" data-action="start-lesson-check" type="button">Начать проверку <span>→</span></button>`;
    return;
  }

  const correct = targets.filter((target) => learnResults[target.key]?.correct).length;
  const passed = learnPhase === 'passed';
  const noun = starsMode ? 'звёзд' : 'объектов';
  const note = passed
    ? `<p class="answer-note">Участок пройден: ${correct} из ${targets.length} ${noun} стоят точно на своих местах.</p>`
    : `<p class="answer-note ${Object.keys(learnResults).length ? 'is-wrong' : ''}">${Object.keys(learnResults).length ? `Верно: ${correct} из ${targets.length}. Красные метки передвиньте и проверьте снова.` : 'Перетащите все метки из боковой панели на соответствующие места карты.'}</p>`;
  missionPanel.innerHTML = `<p class="panel-kicker">ПРОВЕРКА · ${starsMode ? 'ЗВЁЗДЫ TOP-200' : `ПОЛЕ ${field.fov}°`}</p><h2>${escapeHtml(lesson.title)}</h2><p class="panel-text">${starsMode ? 'Собственные имена скрыты. Участок не будет засчитан, пока каждая звёздная метка не окажется в правильных координатах.' : 'Объекты скрыты. Участок не будет засчитан, пока все метки не окажутся в правильных координатах.'}</p>${markerTray(targets, starsMode ? 'ИМЕННЫЕ МЕТКИ ДЛЯ ПЕРЕНОСА' : 'МЕТКИ ДЛЯ ПЕРЕНОСА')}${note}${passed ? `<button class="button panel-button" data-action="next-lesson" type="button">Следующий участок <span>→</span></button>` : `<button class="button panel-button" data-action="check-lesson" type="button" ${targets.every((target) => placedMarkers[target.key]) ? '' : 'disabled'}>Проверить расстановку <span>✓</span></button>`}<button class="panel-subbutton" data-action="restart-lesson" type="button">Вернуться к карте с ответами</button>`;
}

function renderPracticePanel() {
  const target = targetFromMessier(currentTarget || currentObject());
  if (!target) return;
  const hasMarker = Boolean(placedMarkers[target.key]);
  const result = practiceResult
    ? `<p class="answer-note ${practiceResult.correct ? '' : 'is-wrong'}">${practiceResult.correct ? 'Точно! Метка и объект совпали в пределах 2,5°.' : 'Кольцо показывает верное положение. Метку можно снова перетащить и проверить ещё раз.'}</p>`
    : '<p class="answer-note">Перетащите метку из боковой панели на карту, затем нажмите «Проверить».</p>';
  missionPanel.innerHTML = `<p class="panel-kicker">ТРЕНИРОВКА · КАРТА 360°</p><h2>Найдите<br />объект</h2><p class="panel-text">Карта обзора 360° поворачивается мышью или пальцем. Колесо и +/− приближают область, чтобы поставить метку точнее. Подписи Мессье скрыты, а звёзды и линии Modern остаются.</p><div class="target-card"><span class="target-card__label">ВАША ЦЕЛЬ</span><strong>${escapeHtml(target.label)}</strong><span>${escapeHtml(target.title)}<br />${escapeHtml(target.detail)}</span></div>${markerTray([target], 'ВАША ПЕРЕНОСИМАЯ МЕТКА')}<div class="score-grid"><div><b>${score}</b><span>ТОЧНО НАЙДЕНО</span></div><div><b>${streak}</b><span>ТЕКУЩАЯ СЕРИЯ</span></div></div>${result}<button class="button panel-button" data-action="check-practice" type="button" ${hasMarker ? '' : 'disabled'}>Проверить позицию <span>✓</span></button>${practiceResult ? '<button class="panel-subbutton" data-action="next-practice" type="button">Следующий объект</button>' : ''}<button class="panel-subbutton" data-action="new-map" type="button">Новая карта 360°</button>`;
}

function renderPanel() {
  if (mode === 'catalog') {
    renderCatalogPanel();
    return;
  }
  if (isLearningMode()) {
    renderLearningPanel();
    return;
  }
  renderPracticePanel();
}

function renderAtlasText() {
  const starsMode = isStarLearn();
  const lesson = currentLesson();
  const isQuiz = isLearningMode() && learnPhase !== 'study';
  const isCatalog = mode === 'catalog';
  const isRotatable = isCatalog || mode === 'practice';
  let title = '';
  let description = '';
  let kicker = '';
  let hint = '';

  if (isCatalog) {
    title = 'Каталог объектов Мессье';
    description = 'Карта обзора 360° с отмеченными объектами Мессье и линиями созвездий Modern / Современная из Stellarium. Приближайте интересующие области для детального просмотра.';
    kicker = 'Каталог · карта 360° · Modern';
    hint = 'Тяните карту для поворота · колесо или +/− для масштаба';
  } else if (starsMode) {
    title = lesson?.title || 'Курс звёзд';
    description = isQuiz
      ? 'Расставьте все переносимые метки на реальных координатах именованных звёзд и подтвердите результат.'
      : `Учебное поле ${field.fov}° с яркими собственными именами. Это один из маршрутов курса по ${sky.popularStars.length} звёздам.`;
    kicker = isQuiz ? 'Проверка · звёзды TOP-200' : `Звёзды · TOP-200 · поле ${field.fov}°`;
    hint = isQuiz ? 'Перетаскивайте именные метки с панели на карту' : 'Нажмите на фиолетовую метку, чтобы прочитать о звезде';
  } else if (mode === 'learn') {
    title = lesson?.title || 'Обучение Мессье';
    description = isQuiz
      ? 'Расставьте все переносимые метки на реальных координатах объектов и подтвердите результат.'
      : `Учебное поле ${field.fov}° с несколькими объектами Мессье. Все расстояния и положения звёзд соответствуют координатам J2000.`;
    kicker = isQuiz ? 'Проверка · расстановка меток' : `Обучение · поле ${field.fov}°`;
    hint = isQuiz ? 'Перетаскивайте метки с панели на карту' : 'Нажмите на красную точку, чтобы узнать объект';
  } else {
    const focus = currentObject();
    title = `Тренировка: ${focus?.id || 'M13'}`;
    description = `Карта обзора 360°. Приблизьте нужный участок, перетащите метку ${focus?.id || 'цели'} на правильное место и проверьте её.`;
    kicker = 'Тренировка · карта 360°';
    hint = 'Тяните карту для поворота · колесо или +/− для точной метки';
  }

  document.querySelector('#atlas-title').textContent = title;
  document.querySelector('#atlas-kicker').innerHTML = `<span class="eyebrow__dot"></span> ${kicker}`;
  document.querySelector('#atlas-description').textContent = description;
  document.querySelector('#map-coordinate').textContent = formatCoordinates(field.center);
  document.querySelector('#map-fov').textContent = isRotatable
    ? `ОБЗОР 360° · ПОЛЕ ${Math.round(field.fov)}°`
    : `ПОЛЕ ${field.fov}°`;
  document.querySelector('#map-hint').textContent = hint;
  document.querySelector('#map-culture').textContent = sky.modernLoaded ? 'MODERN / СОВРЕМЕННАЯ · STELLARIUM' : 'ЗАПАДНАЯ СХЕМА · РЕЗЕРВ';
  const objectsControl = document.querySelector('#objects-control');
  const mapZoom = document.querySelector('#map-zoom');
  objectsControl.hidden = starsMode;
  objectsControl.style.opacity = mode === 'practice' || isQuiz ? '0.42' : '1';
  controls.objects.disabled = starsMode || mode === 'practice' || isQuiz;
  mapZoom.hidden = !isRotatable;
  document.querySelector('#zoom-level').textContent = `360° · ${zoomScaleText()}`;
  document.querySelector('#zoom-precision').textContent = field.fov >= PANORAMA_FOV_MAX - 0.1 ? 'полный обзор' : `поле ${Math.round(field.fov)}°`;
  document.querySelector('#new-map-label').textContent = isRotatable ? 'Новая карта' : 'Новая область';
  atlasCanvas.classList.toggle('is-rotatable', isRotatable);
  mapStage.classList.toggle('is-rotatable', isRotatable);
}

function renderAtlas() {
  if (!sky.ready) return;
  const isCatalog = mode === 'catalog';
  const starsMode = isStarLearn();
  const starQuiz = starsMode && learnPhase !== 'study';
  const showLessonObjects = mode === 'learn' && learnPhase === 'study';
  renderAtlasText();
  renderPanel();
  drawSky(atlasCanvas, field.center, {
    grid: isCatalog ? false : controls.grid.checked,
    figures: controls.figures.checked,
    starNames: starQuiz ? false : controls.names.checked,
    constellationNames: controls.names.checked,
    objects: (isCatalog || showLessonObjects) && controls.objects.checked,
    objectLabels: isCatalog || showLessonObjects,
    lessonStars: starsMode && learnPhase === 'study',
    fov: field.fov,
  });
}

function renderPreview() {
  if (!sky.ready) return;
  drawSky(homeCanvas, [-97, 31], {
    grid: false,
    figures: true,
    starNames: false,
    constellationNames: false,
    objects: false,
    objectLabels: false,
    lessonStars: false,
    fov: 180,
  });
}

function renderAll() {
  renderPreview();
  if (!document.querySelector('#atlas-view').hidden) renderAtlas();
}

function start(nextMode) {
  mode = nextMode;
  suppressClick = false;
  placedMarkers = {};
  learnResults = {};
  practiceResult = null;
  if (nextMode === 'learn') chooseLesson();
  else if (nextMode === 'starLearn') chooseStarLesson();
  else if (nextMode === 'practice') {
    score = 0;
    streak = 0;
    choosePracticeField();
  } else chooseCatalogField();
  setView('atlas');
  renderAll();
}

function newMap() {
  if (mode === 'catalog') chooseCatalogField();
  else if (mode === 'learn') chooseLesson();
  else if (isStarLearn()) chooseStarLesson();
  else choosePracticeField();
  renderAtlas();
  const message = mode === 'catalog'
    ? 'Карта 360° возвращена к исходному обзору.'
    : mode === 'practice'
      ? 'Открыта новая карта 360° для тренировки.'
      : isStarLearn()
        ? 'Открыт новый участок курса звёзд.'
        : 'Открыта новая учебная область.';
  showToast(message);
}

function nextPractice() {
  choosePracticeField();
  renderAtlas();
}

function pointFromClient(clientX, clientY) {
  const rect = atlasCanvas.getBoundingClientRect();
  const radius = Math.min(rect.width, rect.height) * 0.462;
  const x = clientX - rect.left - rect.width / 2;
  const y = clientY - rect.top - rect.height / 2;
  if (Math.hypot(x, y) > radius) return null;
  return { x, y, radius, coordinates: inverseProject(x, y, field.center, radius, field.fov) };
}

function canvasCoordinates(event) {
  return pointFromClient(event.clientX, event.clientY);
}

function hitPlacedMarker(point) {
  if (!point) return null;
  let match = null;
  let minimum = 18;
  placementIds().forEach((id) => {
    if (!placedMarkers[id]) return;
    const markerPoint = project(placedMarkers[id], field.center, point.radius, 0, 0, field.fov);
    if (!markerPoint) return;
    const distance = Math.hypot(markerPoint.x - point.x, markerPoint.y - point.y);
    if (distance < minimum) {
      minimum = distance;
      match = id;
    }
  });
  return match;
}

function mapClick(event) {
  if (!sky.ready || suppressClick) {
    suppressClick = false;
    return;
  }
  const click = canvasCoordinates(event);
  if (!click) return;
  if (mode === 'catalog' || (mode === 'learn' && learnPhase === 'study')) {
    const hit = displayedObjects()
      .map(({ object }) => ({ object, point: project(object.geometry.coordinates, field.center, click.radius, 0, 0, field.fov) }))
      .find(({ point }) => point && Math.hypot(point.x - click.x, point.y - click.y) < 14);
    if (hit) showToast(`${hit.object.id} — ${objectName(hit.object)}. ${objectType(hit.object)}, ${Number(hit.object.properties.mag).toFixed(1)}m.`);
    return;
  }
  if (isStarLearn() && learnPhase === 'study') {
    const hit = lessonTargets()
      .map((star) => ({ star, point: project(star.coordinates, field.center, click.radius, 0, 0, field.fov) }))
      .find(({ point }) => point && Math.hypot(point.x - click.x, point.y - click.y) < 16);
    if (hit) showToast(`${hit.star.label} (${hit.star.englishName}) · ${constellationNames[hit.star.constellation] || hit.star.constellation} · ${hit.star.magnitude.toFixed(1)}m.`);
  }
}

function beginRotation(event, point) {
  dragState = { type: 'rotation', pointerId: event.pointerId, capture: atlasCanvas, startX: point.x, startY: point.y, startCenter: [...field.center], radius: point.radius, moved: false };
  atlasCanvas.setPointerCapture?.(event.pointerId);
}

function createMarkerGhost(id) {
  const ghost = document.createElement('div');
  ghost.textContent = targetLabel(id);
  ghost.style.cssText = 'position:fixed;z-index:99;pointer-events:none;padding:8px 11px;border:2px solid #1d68e8;border-radius:8px;background:#fff;color:#1d68e8;font:800 12px Inter,Arial,sans-serif;box-shadow:0 8px 24px #1d68e833;transform:translate(-50%,-50%)';
  document.body.append(ghost);
  return ghost;
}

function beginTokenDrag(event, id, source) {
  event.preventDefault();
  const ghost = createMarkerGhost(id);
  ghost.style.left = `${event.clientX}px`;
  ghost.style.top = `${event.clientY}px`;
  dragState = { type: 'marker', pointerId: event.pointerId, id, capture: source, ghost, startX: event.clientX, startY: event.clientY, moved: false, fromCanvas: false };
  source.setPointerCapture?.(event.pointerId);
}

function beginCanvasMarkerDrag(event, id, point) {
  event.preventDefault();
  dragState = { type: 'marker', pointerId: event.pointerId, id, capture: atlasCanvas, startX: event.clientX, startY: event.clientY, moved: false, fromCanvas: true, lastPoint: point };
  atlasCanvas.setPointerCapture?.(event.pointerId);
}

function startCanvasPointer(event) {
  if (!sky.ready) return;
  const point = canvasCoordinates(event);
  if (!point) return;
  const markerId = hitPlacedMarker(point);
  if (markerId) {
    beginCanvasMarkerDrag(event, markerId, point);
    return;
  }
  if (isPanoramaMode()) beginRotation(event, point);
}

function movePointer(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  if (dragState.type === 'rotation') {
    const point = canvasCoordinates(event);
    if (!point) return;
    const dx = point.x - dragState.startX;
    const dy = point.y - dragState.startY;
    const degreePerPixel = field.fov / (2 * dragState.radius);
    if (Math.hypot(dx, dy) > 2) dragState.moved = true;
    field = { ...field, center: [wrapLon(dragState.startCenter[0] + dx * degreePerPixel), clamp(dragState.startCenter[1] + dy * degreePerPixel, -84, 84)] };
    renderAtlas();
    return;
  }
  if (Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY) > 2) dragState.moved = true;
  if (dragState.ghost) {
    dragState.ghost.style.left = `${event.clientX}px`;
    dragState.ghost.style.top = `${event.clientY}px`;
  }
  const point = pointFromClient(event.clientX, event.clientY);
  if (dragState.fromCanvas && point?.coordinates) {
    setPlacedMarker(dragState.id, point.coordinates);
    renderAtlas();
  }
}

function endPointer(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const state = dragState;
  const point = pointFromClient(event.clientX, event.clientY);
  state.capture.releasePointerCapture?.(event.pointerId);
  if (state.type === 'marker') {
    if (point?.coordinates) {
      setPlacedMarker(state.id, point.coordinates);
      renderAtlas();
    }
    state.ghost?.remove();
  }
  suppressClick = state.moved;
  dragState = null;
  setTimeout(() => { suppressClick = false; }, 0);
}

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'home') setView('home');
  if (action === 'open-tour') setView('tour');
  if (action === 'start-learn') start('learn');
  if (action === 'start-star-learn') start('starLearn');
  if (action === 'start-practice') start('practice');
  if (action === 'start-catalog') start('catalog');
  if (action === 'new-map') newMap();
  if (action === 'zoom-in') setPanoramaFov(field.fov / 1.45);
  if (action === 'zoom-out') setPanoramaFov(field.fov * 1.45);
  if (action === 'zoom-reset') setPanoramaFov(PANORAMA_FOV_MAX);
  if (action === 'next-lesson') {
    if (isStarLearn()) chooseStarLesson();
    else chooseLesson();
    renderAtlas();
  }
  if (action === 'start-lesson-check') startLessonCheck();
  if (action === 'check-lesson') checkLesson();
  if (action === 'restart-lesson') {
    learnPhase = 'study';
    placedMarkers = {};
    learnResults = {};
    renderAtlas();
  }
  if (action === 'check-practice') checkPractice();
  if (action === 'next-practice') nextPractice();
});

document.addEventListener('pointerdown', (event) => {
  const token = event.target.closest('[data-marker-token]');
  if (token) beginTokenDrag(event, token.dataset.markerId, token);
});

atlasCanvas.addEventListener('click', mapClick);
atlasCanvas.addEventListener('pointerdown', startCanvasPointer);
atlasCanvas.addEventListener('wheel', (event) => {
  if (!sky.ready || !isPanoramaMode()) return;
  const point = pointFromClient(event.clientX, event.clientY);
  if (!point?.coordinates) return;
  event.preventDefault();
  setPanoramaFov(field.fov * Math.exp(clamp(event.deltaY, -120, 120) * 0.0015));
}, { passive: false });
document.addEventListener('pointermove', movePointer);
document.addEventListener('pointerup', endPointer);
document.addEventListener('pointercancel', endPointer);
Object.values(controls).forEach((control) => control.addEventListener('change', renderAtlas));
window.addEventListener('resize', () => requestAnimationFrame(renderAll));

function splitModernPath(hips, byHip) {
  const segments = [];
  let current = [];
  hips.forEach((hip) => {
    const coordinates = byHip.get(String(hip));
    if (coordinates) {
      current.push(coordinates);
      return;
    }
    if (current.length > 1) segments.push(current);
    current = [];
  });
  if (current.length > 1) segments.push(current);
  return segments;
}

function buildModernLines(modern) {
  const byHip = new Map(sky.stars.map((star) => [String(star.id), star.geometry.coordinates]));
  return (modern.constellations || []).map((constellation) => {
    const id = constellation.id.replace(/^CON modern /, '');
    const coordinates = (constellation.lines || []).flatMap((line) => splitModernPath(line, byHip));
    return { type: 'Feature', id, properties: { rank: '1', label: constellation.common_name?.english || id }, geometry: { type: 'MultiLineString', coordinates } };
  }).filter((feature) => feature.geometry.coordinates.length);
}

function primaryModernName(hip) {
  const aliases = sky.modernNames[`HIP ${hip}`] || [];
  const primary = aliases.find((alias) => alias.english || alias.native);
  return primary?.english?.trim() || primary?.native?.trim() || null;
}

function buildPopularStars() {
  const seenNames = new Set();
  return sky.stars.map((feature) => {
    const hip = String(feature.id);
    const metadata = sky.names[hip] || {};
    const englishName = primaryModernName(hip) || metadata.name?.trim() || null;
    return {
      key: `star:${hip}`,
      hip,
      englishName,
      label: metadata.ru?.trim() || englishName,
      constellation: metadata.c,
      magnitude: Number(feature.properties.mag),
      coordinates: feature.geometry.coordinates,
      kind: 'star',
    };
  }).filter((star) => star.englishName && star.label)
    .sort((a, b) => a.magnitude - b.magnitude || Number(a.hip) - Number(b.hip))
    .filter((star) => {
      const key = star.englishName.toLocaleLowerCase('en-US');
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    }).slice(0, 200);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Источник недоступен: ${response.status}`);
  return response.json();
}

async function loadCatalog() {
  try {
    const [stars, fallbackLines, messier, names, modern] = await Promise.all([
      fetchJson(urls.stars),
      fetchJson(urls.fallbackLines),
      fetchJson(urls.messier),
      fetchJson(urls.names),
      fetchJson(urls.modern).catch(() => null),
    ]);
    sky.stars = stars.features;
    sky.messier = messier.features;
    sky.names = names;
    sky.modernNames = modern?.common_names || {};
    sky.modernLoaded = Boolean(modern?.constellations?.length);
    sky.lines = sky.modernLoaded ? buildModernLines(modern) : fallbackLines.features;
    sky.popularStars = buildPopularStars();
    sky.starLessons = buildStarLessons();
    sky.ready = true;
    mapLoading.classList.add('is-hidden');
    document.querySelector('#status-dot').classList.add('is-ready');
    document.querySelector('#status-text').textContent = sky.modernLoaded ? 'КАТАЛОГ ЗАГРУЖЕН · MODERN / СОВРЕМЕННАЯ' : 'КАТАЛОГ ЗАГРУЖЕН · РЕЗЕРВНЫЕ ЛИНИИ';
    if (mode === 'starLearn') chooseStarLesson();
    else if (mode === 'practice') choosePracticeField();
    else if (mode === 'catalog') chooseCatalogField();
    else chooseLesson();
    renderAll();
    if (!sky.modernLoaded) showToast('Modern Stellarium временно недоступен: использована резервная западная схема.');
  } catch (error) {
    mapLoading.innerHTML = '<p>Не удалось загрузить каталог.<br />Проверьте подключение к интернету и обновите страницу.</p>';
    document.querySelector('#status-text').textContent = 'КАТАЛОГ НЕДОСТУПЕН';
    showToast('Каталог не загрузился: нужен доступ к открытым астрономическим источникам.');
  }
}

loadCatalog();

const DATA_ROOT = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/';
const urls = { stars: `${DATA_ROOT}stars.6.json`, lines: `${DATA_ROOT}constellations.lines.json`, messier: `${DATA_ROOT}messier.json`, names: `${DATA_ROOT}starnames.json` };
const constellationNames = {And:'Андромеда',Ant:'Насос',Aps:'Райская Птица',Aqr:'Водолей',Aql:'Орёл',Ara:'Жертвенник',Ari:'Овен',Aur:'Возничий',Boo:'Волопас',Cae:'Резец',Cam:'Жираф',Cnc:'Рак',CVn:'Гончие Псы',CMa:'Большой Пёс',CMi:'Малый Пёс',Cap:'Козерог',Car:'Киль',Cas:'Кассиопея',Cen:'Центавр',Cep:'Цефей',Cet:'Кит',Cha:'Хамелеон',Cir:'Циркуль',Col:'Голубь',Com:'Волосы Вероники',CrA:'Южная Корона',CrB:'Северная Корона',Crv:'Ворон',Crt:'Чаша',Cru:'Южный Крест',Cyg:'Лебедь',Del:'Дельфин',Dor:'Золотая Рыба',Dra:'Дракон',Equ:'Малый Конь',Eri:'Эридан',For:'Печь',Gem:'Близнецы',Gru:'Журавль',Her:'Геркулес',Hor:'Часы',Hya:'Гидра',Hyi:'Южная Гидра',Ind:'Индеец',Lac:'Ящерица',Leo:'Лев',LMi:'Малый Лев',Lep:'Заяц',Lib:'Весы',Lup:'Волк',Lyn:'Рысь',Lyr:'Лира',Men:'Столовая Гора',Mic:'Микроскоп',Mon:'Единорог',Mus:'Муха',Nor:'Наугольник',Oct:'Октант',Oph:'Змееносец',Ori:'Орион',Pav:'Павлин',Peg:'Пегас',Per:'Персей',Phe:'Феникс',Pic:'Живописец',Psc:'Рыбы',PsA:'Южная Рыба',Pup:'Корма',Pyx:'Компас',Ret:'Сетка',Sge:'Стрела',Sgr:'Стрелец',Sco:'Скорпион',Scl:'Скульптор',Sct:'Щит',Ser:'Змея',Sex:'Секстант',Tau:'Телец',Tel:'Телескоп',Tri:'Треугольник',TrA:'Южный Треугольник',Tuc:'Тукан',UMa:'Большая Медведица',UMi:'Малая Медведица',Vel:'Паруса',Vir:'Дева',Vol:'Летучая Рыба',Vul:'Лисичка'};
const typeNames = {gc:'шаровое скопление',oc:'рассеянное скопление',g:'галактика',sfr:'туманность',pn:'планетарная туманность',snr:'остаток сверхновой',dn:'тёмная туманность',en:'эмиссионная туманность',rn:'отражательная туманность'};
const familiarMessier = {M1:'Крабовидная туманность',M6:'Бабочка',M7:'Скопление Птолемея',M8:'Лагуна',M13:'Большое скопление Геркулеса',M20:'Трёхраздельная туманность',M27:'Гантель',M31:'Галактика Андромеды',M33:'Галактика Треугольника',M42:'Туманность Ориона',M45:'Плеяды',M51:'Водоворот',M57:'Кольцевая туманность',M64:'Чёрный Глаз',M81:'Галактика Боде',M82:'Сигара',M101:'Вертушка',M104:'Сомбреро'};

const homeCanvas = document.querySelector('#home-canvas');
const atlasCanvas = document.querySelector('#atlas-canvas');
const missionPanel = document.querySelector('#mission-panel');
const mapLoading = document.querySelector('#map-loading');
const toast = document.querySelector('#toast');
const controls = { figures: document.querySelector('#figures-toggle'), names: document.querySelector('#names-toggle'), grid: document.querySelector('#grid-toggle'), objects: document.querySelector('#objects-toggle') };
const sky = { ready:false, stars:[], lines:[], messier:[], names:{} };
let mode = 'learn', field = { center:[-109.3,36.5], focusId:'M13' }, currentTarget = null, answer = null, marker = null, score = 0, streak = 0, toastTimer;

const radians = (d) => d * Math.PI / 180;
const degrees = (r) => r * 180 / Math.PI;
const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
const wrapLon = (lon) => ((lon + 180) % 360 + 360) % 360 - 180;
const randomBetween = (min,max) => Math.random() * (max-min) + min;
const currentObject = () => sky.messier.find((object) => object.id === field.focusId);
const objectName = (object) => familiarMessier[object.id] || object.properties.alt || object.properties.desig || 'объект каталога';
const objectType = (object) => typeNames[object.properties.type] || 'объект глубокого неба';

function setView(name) {
  ['home','tour','atlas'].forEach((view) => { const element = document.querySelector(`#${view}-view`); element.hidden = view !== name; element.classList.toggle('is-active', view === name); });
  window.scrollTo({top:0,behavior:'auto'});
  requestAnimationFrame(renderAll);
}

function project(coordinates, center, radius, cx, cy) {
  const [lon,lat] = coordinates, [lon0,lat0] = center;
  const lambda = radians(lon), phi = radians(lat), lambda0 = radians(lon0), phi0 = radians(lat0);
  const delta = lambda-lambda0;
  const cosc = Math.sin(phi0)*Math.sin(phi) + Math.cos(phi0)*Math.cos(phi)*Math.cos(delta);
  if (cosc < 0) return null;
  return { x:cx + radius*Math.cos(phi)*Math.sin(delta), y:cy - radius*(Math.cos(phi0)*Math.sin(phi) - Math.sin(phi0)*Math.cos(phi)*Math.cos(delta)), cosc };
}

function inverseProject(x,y,center,radius) {
  const rho = Math.hypot(x,y) / radius;
  if (rho > 1) return null;
  const [lon0,lat0] = center, phi0 = radians(lat0), lambda0 = radians(lon0), c = Math.asin(rho);
  if (rho === 0) return center;
  const north = -y / radius;
  const phi = Math.asin(Math.cos(c)*Math.sin(phi0) + north*Math.sin(c)*Math.cos(phi0)/rho);
  const lambda = lambda0 + Math.atan2((x/radius)*Math.sin(c),rho*Math.cos(phi0)*Math.cos(c)-north*Math.sin(phi0)*Math.sin(c));
  return [wrapLon(degrees(lambda)),degrees(phi)];
}

function sphericalDistance(a,b) { const [a1,a2] = a.map(radians), [b1,b2] = b.map(radians); return degrees(Math.acos(clamp(Math.sin(a2)*Math.sin(b2)+Math.cos(a2)*Math.cos(b2)*Math.cos(a1-b1),-1,1))); }
function circlePath(ctx,points,center,radius) { let drawing = false; ctx.beginPath(); points.forEach((coord) => { const point = project(coord,center,radius,0,0); if (!point) { drawing=false; return; } if (!drawing) ctx.moveTo(point.x,point.y); else ctx.lineTo(point.x,point.y); drawing=true; }); ctx.stroke(); }
function starColor(bv) { if (bv === undefined || bv === null) return '#6e83a3'; if (bv < .1) return '#4777c5'; if (bv < .6) return '#536b8d'; if (bv < 1.15) return '#8d7b5a'; return '#9a6932'; }
function starRadius(mag) { return clamp(4.4-(mag+1.2)*.57,.52,4.8); }
function resizeCanvas(canvas) { const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return null; const dpr = Math.min(window.devicePixelRatio || 1,2); const width = Math.round(rect.width*dpr), height = Math.round(rect.height*dpr); if (canvas.width!==width || canvas.height!==height) { canvas.width=width; canvas.height=height; } const context=canvas.getContext('2d'); context.setTransform(dpr,0,0,dpr,0,0); return {ctx:context,width:rect.width,height:rect.height}; }

function drawGrid(ctx,center,radius,cx,cy) {
  ctx.save();ctx.translate(cx,cy);ctx.strokeStyle='rgba(127,155,210,.20)';ctx.lineWidth=.65;
  for(let dec=-60;dec<=60;dec+=30){const coords=[];for(let lon=-180;lon<=180;lon+=2)coords.push([lon,dec]);circlePath(ctx,coords,center,radius);}
  for(let lon=-180;lon<180;lon+=30){const coords=[];for(let dec=-89;dec<=89;dec+=2)coords.push([lon,dec]);circlePath(ctx,coords,center,radius);}
  ctx.restore();
}

function drawConstellations(ctx,center,radius,cx,cy,showLabels) {
  ctx.save();ctx.translate(cx,cy);ctx.strokeStyle='rgba(38,84,150,.68)';ctx.lineWidth=1.05;ctx.lineCap='round';
  const labelCandidates=[];
  sky.lines.forEach((feature) => { const groups=feature.geometry.coordinates; groups.forEach((line)=>circlePath(ctx,line,center,radius)); const projected=groups.flat().map((coord)=>project(coord,center,radius,0,0)).filter(Boolean); if (showLabels && feature.properties.rank === '1' && projected.length>3) { const x=projected.reduce((sum,p)=>sum+p.x,0)/projected.length, y=projected.reduce((sum,p)=>sum+p.y,0)/projected.length; if (Math.hypot(x,y)<radius*.84) labelCandidates.push({x,y,name:constellationNames[feature.id]||feature.id}); } });
  if(showLabels){ctx.font='700 9px Inter, sans-serif';ctx.fillStyle='rgba(37,76,135,.62)';ctx.textAlign='center';ctx.textBaseline='middle';const used=[];labelCandidates.forEach((label)=>{if(used.some((point)=>Math.hypot(point.x-label.x,point.y-label.y)<54))return;used.push(label);ctx.fillText(label.name,label.x,label.y);});}
  ctx.restore();
}

function drawStars(ctx,center,radius,cx,cy,showNames) {
  ctx.save();ctx.translate(cx,cy);const named=[];
  sky.stars.forEach((star)=>{const point=project(star.geometry.coordinates,center,radius,0,0);if(!point)return;const mag=star.properties.mag;const r=starRadius(mag);ctx.beginPath();ctx.globalAlpha=clamp(.42+(6-mag)*.16,.4,1);ctx.fillStyle=starColor(star.properties.bv);ctx.arc(point.x,point.y,r,0,Math.PI*2);ctx.fill();if(showNames&&mag<1.75){const name=sky.names[star.id]?.ru||sky.names[star.id]?.name;if(name)named.push({x:point.x,y:point.y,name,mag});}});
  if(showNames){ctx.globalAlpha=1;ctx.font='700 10px Inter, sans-serif';ctx.textBaseline='middle';const used=[];named.sort((a,b)=>a.mag-b.mag).forEach((star)=>{const label={x:star.x+8,y:star.y-7};if(used.some((p)=>Math.hypot(p.x-label.x,p.y-label.y)<48))return;used.push(label);ctx.fillStyle='rgba(26,47,91,.88)';ctx.fillText(star.name,label.x,label.y);});}
  ctx.restore();
}

function visibleObjects(center=field.center) { return sky.messier.map((object)=>({object,point:project(object.geometry.coordinates,center,1,0,0)})).filter(({point})=>point); }
function drawMessier(ctx,center,radius,cx,cy,showLabels) {
  const objects=visibleObjects(center);ctx.save();ctx.translate(cx,cy);ctx.font='800 9px Inter, sans-serif';ctx.textBaseline='middle';
  objects.forEach(({object,point})=>{const x=point.x*radius,y=point.y*radius;ctx.beginPath();ctx.fillStyle='#ed625f';ctx.globalAlpha=.16;ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.globalAlpha=1;ctx.fillStyle='#e65755';ctx.arc(x,y,3.1,0,Math.PI*2);ctx.fill();if(showLabels && (object.properties.mag<7 || object.id===field.focusId)){ctx.fillStyle='#b4474e';ctx.fillText(object.id,x+7,y-6);}});
  if(mode==='practice'&&answer&&currentTarget){const point=project(currentTarget.geometry.coordinates,center,radius,0,0);if(point){ctx.strokeStyle=answer.correct?'#35a97a':'#e85f5c';ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(point.x,point.y,14,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}}
  if(marker){ctx.beginPath();ctx.fillStyle='#fff';ctx.strokeStyle='#1d68e8';ctx.lineWidth=2;ctx.arc(marker.x,marker.y,6,0,Math.PI*2);ctx.fill();ctx.stroke();}
  ctx.restore();
}

function drawSky(canvas,center,options={}) {
  const sized=resizeCanvas(canvas);if(!sized)return;const {ctx,width,height}=sized;ctx.clearRect(0,0,width,height);const radius=Math.min(width,height)*.462,cx=width/2,cy=height/2;
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.clip();ctx.fillStyle='#fcfdff';ctx.fillRect(0,0,width,height);ctx.translate(cx,cy);
  if(options.grid)drawGrid(ctx,center,radius,0,0);drawStars(ctx,center,radius,0,0,options.names);if(options.figures)drawConstellations(ctx,center,radius,0,0,options.names);if(options.objects)drawMessier(ctx,center,radius,0,0,options.objectLabels);ctx.restore();
  ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.strokeStyle='#233b6f';ctx.lineWidth=1.35;ctx.stroke();
  return {radius,cx,cy,width,height};
}

function formatCoordinates([lon,lat]) { const hours=((lon+360)%360)/15, h=Math.floor(hours), min=Math.round((hours-h)*60); return `ЦЕНТР: RA ${String(h).padStart(2,'0')}h ${String(min).padStart(2,'0')}m · DEC ${lat>=0?'+':''}${lat.toFixed(0)}°`; }
function randomField() { if(!sky.ready)return;let next=sky.messier[Math.floor(Math.random()*sky.messier.length)];if(sky.messier.length>1&&next.id===field.focusId){while(next.id===field.focusId)next=sky.messier[Math.floor(Math.random()*sky.messier.length)];}const [lon,lat]=next.geometry.coordinates;field={focusId:next.id,center:[wrapLon(lon+randomBetween(-13,13)),clamp(lat+randomBetween(-10,10),-75,75)]}; }
function showToast(message) { toast.textContent=message;toast.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),3300); }

function renderPanel() {
  const focus=currentObject();if(!focus)return;const visible=visibleObjects().map(({object})=>object).sort((a,b)=>a.properties.mag-b.properties.mag);
  if(mode==='learn'){missionPanel.innerHTML=`<p class="panel-kicker">ОБУЧЕНИЕ · ОТКРЫТЫЙ КАТАЛОГ</p><h2>Смотрите<br />настоящее небо</h2><p class="panel-text">Красные точки — реальные объекты Мессье. Нажмите на точку на карте или выберите новую область вокруг случайного объекта.</p><div class="field-card"><span class="field-card__label">ЦЕНТР МАРШРУТА</span><strong>${focus.id}</strong><small>${objectName(focus)} · ${objectType(focus)}</small></div><div class="object-list">${visible.slice(0,9).map((object)=>`<div class="object-list__item"><span class="object-list__id">${object.id}</span><span><b class="object-list__name">${objectName(object)}</b><small class="object-list__type">${objectType(object)}</small></span><span class="object-list__mag">${object.properties.mag.toFixed(1)}m</span></div>`).join('')}</div><button class="button panel-button" data-action="new-map" type="button">Другая случайная область <span>→</span></button>`;}
  else {const target=currentTarget||focus;const result=answer?`<p class="answer-note ${answer.correct?'':'is-wrong'}">${answer.correct?'Точно! Метка находится в допуске 2,5° от реальной позиции объекта.':'Ответ показан кольцом на карте. Запомните его положение относительно ярких звёзд и линий.'}</p>`:'<p class="answer-note">Ориентируйтесь по фигурам созвездий и ярким звёздам. Поставьте метку в предполагаемом месте.</p>';missionPanel.innerHTML=`<p class="panel-kicker">ТРЕНИРОВКА · РЕАЛЬНАЯ КАРТА</p><h2>Найдите<br />объект</h2><p class="panel-text">Названия Мессье скрыты, но все реальные звёзды и правильные линии созвездий остаются.</p><div class="target-card"><span class="target-card__label">ВАША ЦЕЛЬ</span><strong>${target.id}</strong><span>${objectName(target)}<br />${objectType(target)}</span></div><div class="score-grid"><div><b>${score}</b><span>ТОЧНО НАЙДЕНО</span></div><div><b>${streak}</b><span>ТЕКУЩАЯ СЕРИЯ</span></div></div>${result}<button class="button panel-button" data-action="next-practice" type="button" ${answer?'':'disabled'}>${answer?'Следующий объект →':'Поставьте метку на карте'}</button><button class="panel-subbutton" data-action="new-map" type="button">Сменить область</button>`;}
}

function renderAtlasText() { const focus=currentObject();if(!focus)return;document.querySelector('#atlas-title').textContent=`Окрестности ${focus.id}`;document.querySelector('#atlas-kicker').innerHTML=`<span class="eyebrow__dot"></span> ${mode==='learn'?'Обучение · открытый каталог':'Тренировка · объект без подписи'}`;document.querySelector('#atlas-description').textContent=`Круг показывает настоящую небесную полусферу вокруг ${focus.id}. Положение каждой звезды и линии определяется координатами J2000.`;document.querySelector('#map-coordinate').textContent=formatCoordinates(field.center);document.querySelector('#map-hint').textContent=mode==='learn'?'Нажмите на красную точку, чтобы узнать объект':'Поставьте метку там, где должен быть объект';document.querySelector('#objects-control').style.opacity=mode==='practice'?'.42':'1';controls.objects.disabled=mode==='practice'; }
function renderAtlas() {if(!sky.ready)return;renderAtlasText();renderPanel();drawSky(atlasCanvas,field.center,{grid:controls.grid.checked,figures:controls.figures.checked,names:controls.names.checked,objects:mode==='learn'&&controls.objects.checked,objectLabels:mode==='learn'});}
function renderPreview(){if(sky.ready)drawSky(homeCanvas,[-97,31],{grid:false,figures:true,names:false,objects:false,objectLabels:false});}
function renderAll(){renderPreview();if(!document.querySelector('#atlas-view').hidden)renderAtlas();}

function start(nextMode){mode=nextMode;score=0;streak=0;answer=null;marker=null;randomField();currentTarget=mode==='practice'?currentObject():null;setView('atlas');renderAll();}
function newMap(){randomField();answer=null;marker=null;if(mode==='practice')currentTarget=currentObject();renderAtlas();showToast('Открыта новая область настоящего неба.');}
function nextPractice(){answer=null;marker=null;randomField();currentTarget=currentObject();renderAtlas();}
function canvasCoordinates(event){const rect=atlasCanvas.getBoundingClientRect(),radius=Math.min(rect.width,rect.height)*.462;return {x:event.clientX-rect.left-rect.width/2,y:event.clientY-rect.top-rect.height/2,radius};}
function mapClick(event){if(!sky.ready)return;const click=canvasCoordinates(event);if(Math.hypot(click.x,click.y)>click.radius)return;if(mode==='learn'){const hit=visibleObjects().map(({object})=>({object,point:project(object.geometry.coordinates,field.center,click.radius,0,0)})).find(({point})=>Math.hypot(point.x-click.x,point.y-click.y)<13);if(hit)showToast(`${hit.object.id} — ${objectName(hit.object)}. ${objectType(hit.object)}, ${hit.object.properties.mag.toFixed(1)}m.`);return;}if(answer)return;const picked=inverseProject(click.x,click.y,field.center,click.radius);if(!picked)return;marker={x:click.x,y:click.y};const distance=sphericalDistance(picked,currentTarget.geometry.coordinates);answer={correct:distance<=2.5,distance};if(answer.correct){score++;streak++;showToast(`Верно: ${currentTarget.id} найден с точностью ${distance.toFixed(1)}°.`);}else{streak=0;showToast(`Позиция ${currentTarget.id} показана кольцом. Ошибка: ${distance.toFixed(1)}°.`);}renderAtlas();}

document.addEventListener('click',(event)=>{const action=event.target.closest('[data-action]')?.dataset.action;if(!action)return;if(action==='home')setView('home');if(action==='open-tour')setView('tour');if(action==='start-learn')start('learn');if(action==='start-practice')start('practice');if(action==='new-map')newMap();if(action==='next-practice')nextPractice();});
atlasCanvas.addEventListener('click',mapClick);Object.values(controls).forEach((control)=>control.addEventListener('change',renderAtlas));window.addEventListener('resize',()=>requestAnimationFrame(renderAll));

async function loadCatalog() { try { const responses=await Promise.all(Object.values(urls).map((url)=>fetch(url)));if(responses.some((response)=>!response.ok))throw new Error('Каталог недоступен');const [stars,lines,messier,names]=await Promise.all(responses.map((response)=>response.json()));sky.stars=stars.features;sky.lines=lines.features;sky.messier=messier.features;sky.names=names;sky.ready=true;mapLoading.classList.add('is-hidden');document.querySelector('#status-dot').classList.add('is-ready');document.querySelector('#status-text').textContent='КАТАЛОГ ЗАГРУЖЕН · J2000';randomField();renderAll();}catch(error){document.querySelector('#map-loading').innerHTML='<p>Не удалось загрузить каталог.<br />Проверьте подключение к интернету и обновите страницу.</p>';document.querySelector('#status-text').textContent='КАТАЛОГ НЕДОСТУПЕН';showToast('Каталог не загрузился: нужен доступ к открытому астрономическому источнику.');} }
loadCatalog();

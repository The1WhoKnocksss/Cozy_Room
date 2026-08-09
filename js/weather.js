const MOSCOW_LAT = 55.7522;
const MOSCOW_LON = 37.6156;
let isRaining = false; 

// === ЭЛЕМЕНТЫ DOM И АУДИО ===
const dayBirdsAudio = document.getElementById('day-birds');
const nightCricketsAudio = document.getElementById('night-crickets');
const wallLamps = document.getElementById('wall_lamps');

// Установка низкой громкости фоновых звуков (10%)
if (dayBirdsAudio) dayBirdsAudio.volume = 0.1;
if (nightCricketsAudio) nightCricketsAudio.volume = 0.1;

// === ЛОГИКА СЧЕТЧИКА ВИЗИТОВ И РОЗОВОЙ АНОМАЛИИ ===
function checkPinkAnomalyEligibility() {
  let visits = parseInt(localStorage.getItem('cozy_room_visit_count') || '0', 10);
  visits += 1;
  localStorage.setItem('cozy_room_visit_count', visits.toString());

  // Первые 5 загрузок аномалия гарантированно не появляется
  if (visits <= 5) {
    return false;
  }

  // Начиная с 6-й загрузки — 3% шанс
  const PINK_CHANCE = 0.03;
  return Math.random() < PINK_CHANCE;
}

const isPinkAnomaly = checkPinkAnomalyEligibility();

// === СОСТОЯНИЕ ПАСХАЛКИ ДЛЯ ЛАМП ===
let isLampsSpawnedThisSession = null;

/**
 * Проверка права на появление ламп (20% шанс, не при первом визите)
 */
function checkLampsSpawnEligibility() {
  const isFirstVisit = !localStorage.getItem('cozy_room_visited');
  if (isFirstVisit) return false;

  if (isLampsSpawnedThisSession === null) {
    const LAMPS_CHANCE = 0.2;
    isLampsSpawnedThisSession = Math.random() < LAMPS_CHANCE;
  }

  return isLampsSpawnedThisSession;
}

/**
 * Переключение видимости ламп в зависимости от времени суток и шанса
 */
function updateWallLamps() {
  if (!wallLamps) return;

  const currentHour = new Date().getHours();
  // Вечер и ночь: с 18:00 до 06:00
  const isEveningOrNight = currentHour >= 18 || currentHour < 6;

  const shouldShowLamps = isEveningOrNight && checkLampsSpawnEligibility();
  wallLamps.style.display = shouldShowLamps ? 'block' : 'none';
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ЦВЕТА ===
function blendColors(color1, color2, percentage) {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * percentage);
  const g = Math.round(g1 + (g2 - g1) * percentage);
  const b = Math.round(b1 + (b2 - b1) * percentage);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// === ЛОГИКА ДОЖДЯ И ПОГОДЫ ===
function toggleRainEffect(enable) {
  const rainContainer = document.getElementById('rain');
  if (!rainContainer) return;
  rainContainer.innerHTML = '';
  if (enable) {
    for (let i = 0; i < 25; i++) {
      const drop = document.createElement('div');
      drop.classList.add('drop');
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDelay = `${Math.random() * 0.6}s`;
      drop.style.animationDuration = `${0.4 + Math.random() * 0.3}s`;
      rainContainer.appendChild(drop);
    }
  }
}

async function checkWeather() {
  if (isPinkAnomaly) {
    toggleRainEffect(false);
    updateDynamicSky();
    return;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${MOSCOW_LAT}&longitude=${MOSCOW_LON}&current=rain,showers`;
    const response = await fetch(url);
    const data = await response.json();
    isRaining = data.current.rain > 0 || data.current.showers > 0;

    toggleRainEffect(isRaining);
    updateDynamicSky(); 
  } catch (error) {
    console.error("Ошибка погоды:", error);
  }
}

// === РАСЧЕТ ДИНАМИЧЕСКОГО НЕБА И ОСВЕЩЕНИЯ ===
function updateDynamicSky() {
  const sky = document.getElementById('sky');
  const moon = document.getElementById('moon');
  const lighting = document.getElementById('lighting');
  const moonLight = document.getElementById('moonLight');
  const windowLight = document.getElementById('windowLight');

  if (!sky || !moon || !lighting) return;

  // === ОБРАБОТКА РОЗОВОЙ АНОМАЛИИ ===
if (isPinkAnomaly) {
    // Фон за окном
    sky.style.background = "url('assets/dreams.png') center/cover no-repeat";

    // Прячем луну и её свет
    moon.style.opacity = 0;
    moon.classList.remove('active-clicks');
    if (moonLight) moonLight.style.opacity = 0;

    // Мягкий нежно-розовый фильтр на комнату
    lighting.style.background = hexToRgba('#ff66b2', 0.15); // Было 0.35 -> снизили до 0.15
    lighting.style.filter = 'brightness(105%)';             // Было 130% -> убрали резкую засветку

    // Мягкий свет из окна
    if (windowLight) {
      windowLight.style.opacity = 0.35;                      // Было 0.85 -> снизили прозрачность
      windowLight.style.background = hexToRgba('#ff99dd', 0.2); // Пастельно-розовый оттенок
    }

    toggleRainEffect(false);
    updateWallLamps();
    return;
  }

  // === ОБЫЧНЫЙ РАСЧЕТ ВРЕМЕНИ СУТОК ===
  const now = new Date();
  const minutesInDay = now.getHours() * 60 + now.getMinutes();
  const currentHour = now.getHours();

  const timeline = [
    { time: 0,    skyTop: '#07162d', skyBottom: '#213d67', lightColor: '#050a24', lightAlpha: 0.55, brightness: 45 },
    { time: 360,  skyTop: '#ff9e7d', skyBottom: '#639aff', lightColor: '#ffe5ad', lightAlpha: 0.25, brightness: 100 },
    { time: 720,  skyTop: '#bef2ff', skyBottom: '#4da3ff', lightColor: '#fffdf0', lightAlpha: 0.00, brightness: 150 },
    { time: 1080, skyTop: '#e15f8d', skyBottom: '#3b3177', lightColor: '#4a2861', lightAlpha: 0.45, brightness: 70 },
    { time: 1320, skyTop: '#07162d', skyBottom: '#213d67', lightColor: '#050a24', lightAlpha: 0.55, brightness: 45 },
    { time: 1440, skyTop: '#07162d', skyBottom: '#213d67', lightColor: '#050a24', lightAlpha: 0.55, brightness: 45 }
  ];

  let startNode = timeline[0];
  let endNode = timeline[0];
  for (let i = 0; i < timeline.length - 1; i++) {
    if (minutesInDay >= timeline[i].time && minutesInDay < timeline[i+1].time) {
      startNode = timeline[i];
      endNode = timeline[i+1];
      break;
    }
  }

  const totalSegmentTime = endNode.time - startNode.time;
  const timePassed = minutesInDay - startNode.time;
  const percentage = timePassed / totalSegmentTime;

  const currentSkyTop = blendColors(startNode.skyTop, endNode.skyTop, percentage);
  const currentSkyBottom = blendColors(startNode.skyBottom, endNode.skyBottom, percentage);
  sky.style.background = `linear-gradient(to bottom, ${currentSkyTop}, ${currentSkyBottom})`;

  const blendedLightHex = blendColors(startNode.lightColor, endNode.lightColor, percentage);
  const currentAlpha = startNode.lightAlpha + (endNode.lightAlpha - startNode.lightAlpha) * percentage;
  let currentBrightness = startNode.brightness + (endNode.brightness - startNode.brightness) * percentage;

  if (isRaining) {
    currentBrightness = Math.max(35, currentBrightness - 20); 
  }

  lighting.style.background = hexToRgba(blendedLightHex, currentAlpha);
  lighting.style.filter = `brightness(${currentBrightness}%)`;

  // === РАСЧЕТ ДЛЯ ЛУНЫ И НОЧНОГО СВЕТА ===
  let moonOpacity = 0;
  if (minutesInDay >= 1260 && minutesInDay < 1290) { 
    moonOpacity = (minutesInDay - 1260) / 30;
  } else if (minutesInDay >= 1290 || minutesInDay < 330) {
    moonOpacity = 1;
  } else if (minutesInDay >= 330 && minutesInDay < 360) {
    moonOpacity = 1 - ((minutesInDay - 330) / 30);
  } else {
    moonOpacity = 0;
  }

  moon.style.opacity = moonOpacity;
  if (moonLight) {
    moonLight.style.opacity = moonOpacity;
  }

  // === РАСЧЕТ ДЛЯ ДНЕВНОГО СВЕТА ИЗ ОКНА ===
  if (windowLight) {
    let windowOpacity = 0;

    if (minutesInDay >= 360 && minutesInDay < 540) {
      windowOpacity = 0.2 + ((minutesInDay - 360) / 180) * 0.4;
    } else if (minutesInDay >= 540 && minutesInDay < 1020) {
      windowOpacity = 0.6;
    } else if (minutesInDay >= 1020 && minutesInDay < 1260) {
      windowOpacity = 0.6 - ((minutesInDay - 1020) / 240) * 0.6;
    } else {
      windowOpacity = 0;
    }

    if (isRaining) {
      windowOpacity *= 0.6;
    }

    windowLight.style.opacity = windowOpacity;
    windowLight.style.background = ''; // Сброс кастомного фона при обычной погоде
  }

  if (currentHour >= 21 || currentHour < 6) {
    moon.classList.add('active-clicks');
  } else {
    moon.classList.remove('active-clicks');
  }

  updateWallLamps();
}

/**
 * Логика случайного проигрывания фоновых звуков
 */
function scheduleAmbientSound() {
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 21 || currentHour < 6;

  if (isNight) {
    if (nightCricketsAudio) {
      nightCricketsAudio.currentTime = 0;
      nightCricketsAudio.play().catch(() => {});
    }
  } else {
    if (dayBirdsAudio) {
      dayBirdsAudio.currentTime = 0;
      dayBirdsAudio.play().catch(() => {});
    }
  }

  const randomDelay = (4 + Math.random() * 2) * 60 * 1000;
  setTimeout(scheduleAmbientSound, randomDelay);
}

// === ИНИЦИАЛИЗАЦИЯ ===
setTimeout(scheduleAmbientSound, (1 + Math.random()) * 60 * 1000);

document.body.classList.add('no-transition');

updateDynamicSky();
checkWeather();

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.remove('no-transition');
  });
});

setInterval(updateDynamicSky, 60000);
setInterval(checkWeather, 900000);
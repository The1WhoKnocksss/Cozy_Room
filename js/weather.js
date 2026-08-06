const MOSCOW_LAT = 55.7522;
const MOSCOW_LON = 37.6156;
let isRaining = false; 

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

// ОБНОВЛЕННАЯ ФУНКЦИЯ ПРОВЕРКИ ПОГОДЫ С ЛОГАМИ
async function checkWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${MOSCOW_LAT}&longitude=${MOSCOW_LON}&current=rain,showers`;
    const response = await fetch(url);
    const data = await response.json();
    isRaining = data.current.rain > 0 || data.current.showers > 0;

    // Вывод лога в консоль браузера
    if (isRaining) {
      console.log("В Москве сейчас идет дождь 🌧️");
    } else {
      console.log("В Москве сейчас нет дождя ☀️");
    }

    toggleRainEffect(isRaining);
    updateDynamicSky(); 
  } catch (error) {
    console.error("Ошибка погоды:", error);
  }
}

function updateDynamicSky() {
  const sky = document.getElementById('sky');
  const moon = document.getElementById('moon');
  const lighting = document.getElementById('lighting');
  if (!sky || !moon || !lighting) return;

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

  if (currentHour >= 21 || currentHour < 6) {
    moon.classList.add('active-clicks');
  } else {
    moon.classList.remove('active-clicks');
  }
}

// МГНОВЕННАЯ ИНИЦИАЛИЗАЦИЯ БЕЗ ПЕРЕХОДНОГО ЭФФЕКТА
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
const teddy = document.getElementById("bear");
const overlay = document.getElementById("noteOverlay");
const note = document.getElementById("noteImage");
const teddyAudio = document.getElementById("Teddy_note_audio"); // Подключаем звук медведя

console.log("teddy:", teddy);
console.log("overlay:", overlay);
console.log("note:", note);

const TOTAL_NOTES = 15;

function getTodayNote() {
    const today = new Date().toDateString();

    const savedDay = localStorage.getItem("teddyDay");
    const savedNote = localStorage.getItem("teddyNote");

    if (savedDay === today) {
        return savedNote;
    }

    const random = Math.floor(Math.random() * TOTAL_NOTES) + 1;

    localStorage.setItem("teddyDay", today);
    localStorage.setItem("teddyNote", random);

    return random;
}

teddy.addEventListener("click", () => {
    const number = getTodayNote();

    note.src = `assets/teddy_notes/Teddy-${number}.png`;

    overlay.classList.add("show");

    // Воспроизводим звук при клике на медведя
    if (teddyAudio) {
        teddyAudio.currentTime = 0; // Сбрасываем на начало на случай частых кликов
        teddyAudio.play().catch(err => console.log("Ошибка воспроизведения звука медведя:", err));
    }
});

overlay.addEventListener("click", () => {
    overlay.classList.remove("show");
    
    // По желанию: останавливаем звук при закрытии окна
    if (teddyAudio) {
        teddyAudio.pause();
    }
});



// Находим элементы
const triggerContainer = document.querySelector('.yarns-container');
const popupToast = document.getElementById('popup-toast');
const yarnsAudio = document.getElementById('Yarns_audio'); // Подключаем аудио пряжи

const YARNS_SOUND_VOLUME = 0.05; // Настройка тихой громкости (5%)
let popupTimer = null;

if (triggerContainer) {
  // Обработчик клика на контейнер
  triggerContainer.addEventListener('click', () => {
    // Включаем звук пряжи при клике
    if (yarnsAudio) {
      yarnsAudio.volume = YARNS_SOUND_VOLUME; // Устанавливаем громкость
      yarnsAudio.currentTime = 0;             // Сбрасываем на начало для быстрых кликов подряд
      yarnsAudio.play().catch(err => console.log("Ошибка воспроизведения звука пряжи:", err));
    }

    // Показываем плашку
    if (popupToast) {
      popupToast.classList.add('show');

      // Сбрасываем старый таймер, если кликнули еще раз до того, как плашка исчезла
      clearTimeout(popupTimer);

      // Прячем плашку обратно через 3000 миллисекунд (3 секунды)
      popupTimer = setTimeout(() => {
        popupToast.classList.remove('show');
      }, 3000);
    }
  });
}


// Находим элементы в HTML
const duckOverlay = document.getElementById('duckOverlay');
// ЗАМЕНИТЕ 'yourTriggerButton' на ID или класс вашего нижнего контейнера
const openTrigger = document.getElementById('duck'); 

// Функция для открытия записки
openTrigger.addEventListener('click', () => {
  duckOverlay.classList.add('active');
});

// Функция для закрытия записки по повторному клику
duckOverlay.addEventListener('click', () => {
  duckOverlay.classList.remove('active');
});


const player = document.getElementById('player');
const playerOverlay = document.getElementById('playerOverlay');
const playerNote = document.getElementById('playerNote');
const playerMusic = document.getElementById('playerMusic');

// 1. Массив со всеми 7 песнями и их картинками
const playlist = [
  { audio: 'audio/mp1.mp3', image: 'assets/mp3player/mp3player_1.png' }, // Индекс 0 — гарантирован на весь первый день
  { audio: 'audio/mp2.mp3', image: 'assets/mp3player/mp3player_2.png' },
  { audio: 'audio/mp3.mp3', image: 'assets/mp3player/mp3player_3.png' },
  { audio: 'audio/mp4.mp3', image: 'assets/mp3player/mp3player_4.png' },
  { audio: 'audio/mp5.mp3', image: 'assets/mp3player/mp3player_5.png' },
  { audio: 'audio/mp6.mp3', image: 'assets/mp3player/mp3player_6.png' },
  { audio: 'audio/mp7.mp3', image: 'assets/mp3player/mp3player_7.png' }
];

// 2. Функция выбора трека (фиксация первого трека на весь первый день)
function getTodayTrack() {
  const FIRST_VISIT_INDEX = 0; 
  const todayString = new Date().toDateString();
  let firstVisitDate = localStorage.getItem('playerFirstVisitDate');

  // Если зашли впервые за всё время — запоминаем дату первого посещения
  if (!firstVisitDate) {
    firstVisitDate = todayString;
    localStorage.setItem('playerFirstVisitDate', firstVisitDate);
  }

  // Весь первый день захода будет играться песня №1
  if (todayString === firstVisitDate) {
    return playlist[FIRST_VISIT_INDEX];
  }

  // Начиная со второго дня включается ежедневная ротация
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const trackIndex = dayOfYear % playlist.length;
  return playlist[trackIndex];
}

let fadeInterval;

// Функция для плавного изменения громкости плеера
function fadeAudio(targetVolume, duration = 1000) {
  clearInterval(fadeInterval);
  
  const step = 0.05;
  const intervalTime = duration * step;

  fadeInterval = setInterval(() => {
    if (playerMusic.volume < targetVolume) {
      playerMusic.volume = Math.min(playerMusic.volume + step, targetVolume);
    } else if (playerMusic.volume > targetVolume) {
      playerMusic.volume = Math.max(playerMusic.volume - step, targetVolume);
    }

    if (playerMusic.volume === targetVolume) {
      clearInterval(fadeInterval);
      if (targetVolume === 0) playerMusic.pause();
    }
  }, intervalTime);
}

// Открытие по клику на плеер
player.addEventListener('click', () => {
  const currentTrack = getTodayTrack();

  if (!playerMusic.src.includes(encodeURI(currentTrack.audio))) {
    playerMusic.src = currentTrack.audio;
  }
  playerNote.src = currentTrack.image;

  playerOverlay.classList.add('active');
  
  playerMusic.volume = 0;
  playerMusic.play().catch(err => console.log('Автовоспроизведение заблокировано:', err));
  fadeAudio(0.03, 1500);

  // Оповещаем фоновую музыку, что плеер открылся
  window.dispatchEvent(new CustomEvent('playerOpened'));
});

// Закрытие по клику на оверлей
playerOverlay.addEventListener('click', () => {
  playerOverlay.classList.remove('active');
  fadeAudio(0, 800);

  // Оповещаем фоновую музыку, что плеер закрылся
  window.dispatchEvent(new CustomEvent('playerClosed'));
});



// === КОД ДЛЯ ЧАШКИ (ПОЛНОСТЬЮ ИЗОЛИРОВАННЫЙ) ===

// === КОД ДЛЯ ЧАШКИ (ПОЛНОСТЬЮ ИЗОЛИРОВАННЫЙ) ===

const cupTrigger = document.getElementById("cup");
const cupOverlay = document.getElementById("cupNoteOverlay"); 
const cupImage = document.getElementById("cupNoteImage");     
const cupAudio = document.getElementById("Cup_audio");         

const TOTAL_CUP_NOTES = 10; 
const CUP_SOUND_VOLUME = 0.05; // Настройка громкости (например: 0.02 = 2%, 0.1 = 10%, 0.5 = 50%)

function getTodayCupNote() {
    const today = new Date().toDateString();
    
    const savedCupDay = localStorage.getItem("cupDay");
    const savedCupNote = localStorage.getItem("cupNote");

    if (savedCupDay === today) {
        return savedCupNote;
    }

    const random = Math.floor(Math.random() * TOTAL_CUP_NOTES) + 1;

    localStorage.setItem("cupDay", today);
    localStorage.setItem("cupNote", random);

    return random;
}

// Открытие по клику на чашку
cupTrigger.addEventListener("click", () => {
    const number = getTodayCupNote();
    
    cupImage.src = `assets/cup_notes/cup-${number}.png`; 
    cupOverlay.classList.add("cup-show");

    if (cupAudio) {
        cupAudio.volume = CUP_SOUND_VOLUME; // Устанавливаем уменьшенную громкость
        cupAudio.currentTime = 0; 
        cupAudio.play().catch(err => console.log("Ошибка воспроизведения звука чашки:", err));
    }
});

// Закрытие по клику на оверлей чашки
cupOverlay.addEventListener("click", () => {
    cupOverlay.classList.remove("cup-show");

    if (cupAudio) {
        cupAudio.pause();
    }
});

// === КОД ДЛЯ ЦВЕТКА (ПОЛНОСТЬЮ ИЗОЛИРОВАННЫЙ) ===
// === КОД ДЛЯ ЦВЕТКА ===

const flowerTrigger = document.querySelector('.flower-container');
const flowerOverlay = document.getElementById('flowerNoteOverlay');
const plantAudio = document.getElementById('Plant_audio');

const PLANT_SOUND_VOLUME = 0.05; // Настройка громкости (5%)

if (flowerTrigger) {
    // Открытие по клику на цветок
    flowerTrigger.addEventListener('click', () => {
        flowerOverlay.classList.add('flower-show');

        // Включаем звук цветка
        if (plantAudio) {
            plantAudio.volume = PLANT_SOUND_VOLUME; // Тихая громкость
            plantAudio.currentTime = 0;             // Сброс на начало
            plantAudio.play().catch(err => console.log("Ошибка воспроизведения звука цветка:", err));
        }
    });
}

if (flowerOverlay) {
    // Закрытие по клику на оверлей
    flowerOverlay.addEventListener('click', () => {
        flowerOverlay.classList.remove('flower-show');

        // Останавливаем звук при закрытии
        if (plantAudio) {
            plantAudio.pause();
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    // Настройки
    const IMAGE_FOLDER = "assets/album_pages/";
    const IMAGE_EXTENSION = ".png";
    const TOTAL_PAGES = 11;
    const ALBUM_SOUND_VOLUME = 0.05;
    const DEUTSCH_CHANCE = 0.05; // 5% шанс при каждой загрузке страницы

    // Находим элементы
    const albumOverlay = document.getElementById('album-page-overlay');
    const albumImg = document.getElementById('album-page-img');
    const albumBtn = document.getElementById('album'); 
    const deutschBtn = document.getElementById('deutsch-book');
    const albumAudio = document.getElementById('Album_audio');

    // === 1. ПОЯВЛЕНИЕ ТЕТРАДИ ПРИ КАЖДОМ ЗАХОДЕ/ОБНОВЛЕНИИ ===
    const isDeutschSpawned = Math.random() < DEUTSCH_CHANCE;

    if (isDeutschSpawned && deutschBtn) {
        if (albumBtn) albumBtn.style.display = 'none';
        deutschBtn.style.display = 'block';
    } else {
        if (deutschBtn) deutschBtn.style.display = 'none';
        if (albumBtn) albumBtn.style.display = 'block';
    }

    // === 2. ЕЖЕДНЕВНАЯ СТРАНИЦА ДЛЯ АЛЬБОМА (1 СТРАНИЦА В ДЕНЬ) ===
    function getDailyPageNumber() {
        const todayString = new Date().toDateString();
        let savedDate = localStorage.getItem('album_img_date');
        let savedNumber = localStorage.getItem('album_img_number');

        if (savedDate !== todayString || savedNumber === null) {
            savedNumber = Math.floor(Math.random() * TOTAL_PAGES) + 1;
            localStorage.setItem('album_img_date', todayString);
            localStorage.setItem('album_img_number', savedNumber);
        }

        return savedNumber;
    }

    // === 3. ФУНКЦИЯ ОТКРЫТИЯ С ОВЕРЛЕЕМ И ЗВУКОМ ===
    function openOverlay(imageSrc) {
        if (!albumOverlay || !albumImg) return;

        albumImg.src = imageSrc;
        albumOverlay.classList.add('album-page-visible');

        if (albumAudio) {
            albumAudio.volume = ALBUM_SOUND_VOLUME;
            albumAudio.currentTime = 0;
            albumAudio.play().catch(err => console.log("Ошибка воспроизведения звука:", err));
        }
    }

    // === 4. КЛИКИ ПО ПРЕДМЕТАМ ===

    // Клик по альбому (страница фиксирована на день)
    if (albumBtn) {
        albumBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pageNum = getDailyPageNumber();
            openOverlay(`${IMAGE_FOLDER}page-${pageNum}${IMAGE_EXTENSION}`);
        });
    }

    // Клик по тетради (всегда одна разворот-страница)
    if (deutschBtn) {
        deutschBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openOverlay('assets/deutsch.png');
        });
    }

    // Закрытие при клике в любое место
    if (albumOverlay) {
        albumOverlay.addEventListener('click', () => {
            albumOverlay.classList.remove('album-page-visible');
            if (albumAudio) {
                albumAudio.pause();
            }
        });
    }
});
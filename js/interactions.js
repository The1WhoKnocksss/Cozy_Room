const pizza = document.getElementById('pizza');
const pizzaCardOverlay = document.getElementById('pizzaCardOverlay');
const pizzaCard = document.getElementById('pizzaCard');
const pizzaAudio = document.getElementById('Pizza_audio'); // Подключаем элемент звука пиццы

const PIZZA_SOUND_VOLUME = 0.03; // Настройка тихой громкости (5%)

// 5 состояний куска пиццы
const pizzaStates = [
  'assets/pizza_states/pizza_state1.png', // Целый кусок (индекс 0)
  'assets/pizza_states/pizza_state2.png', // 1 укус (индекс 1)
  'assets/pizza_states/pizza_state3.png', // 2 укус (индекс 2)
  'assets/pizza_states/pizza_state4.png', // Предпоследний укус (индекс 3)
  'assets/pizza_states/pizza_state5.png'  // Последний укус / корочка (индекс 4)
];

// 4 записки
const pizzaCards = [
  'assets/pizza_states/card1.png',
  'assets/pizza_states/card2.png',
  'assets/pizza_states/card3.png',
  'assets/pizza_states/card4.png'
];

let currentStateIndex = 0;
let cardHideTimeout;

if (pizza) {
  pizza.src = pizzaStates[currentStateIndex];

  pizza.addEventListener('click', () => {
    // Включаем звук укуса при каждом клике
    if (pizzaAudio) {
      pizzaAudio.volume = PIZZA_SOUND_VOLUME; // Устанавливаем громкость
      pizzaAudio.currentTime = 0;             // Перемотка на начало для быстрого повторного клика
      pizzaAudio.play().catch(err => console.log("Ошибка воспроизведения звука пиццы:", err));
    }

    currentStateIndex++;
    clearTimeout(cardHideTimeout);

    // Сразу прячем текущую открытую записку, если она была на экране
    pizzaCardOverlay.classList.remove('show');

    // МГНОВЕННО проверяем: если это 5-й клик — сразу полностью удаляем кусок пиццы из игры
    if (currentStateIndex >= pizzaStates.length) {
      pizza.remove();
    } else {
      // Если куски еще есть — просто меняем спрайт на следующий
      pizza.src = pizzaStates[currentStateIndex];
    }

    let nextCardSrc = null;

    // Назначаем карточки строго по укусам
    switch (currentStateIndex) {
      case 1:
        nextCardSrc = 'assets/pizza_states/card1.png';
        break;
      case 2:
        nextCardSrc = 'assets/pizza_states/card2.png';
        break;
      case 3:
        nextCardSrc = null; // Третий укус — пропускаем, ничего не выводим
        break;
      case 4:
        nextCardSrc = 'assets/pizza_states/card3.png';
        break;
      case 5:
        nextCardSrc = 'assets/pizza_states/card4.png'; // Последняя записка после исчезновения пиццы
        break;
    }

    // Если для этого шага есть карточка — запускаем её появление
    if (nextCardSrc) {
      // Задержка: для 5-го клика делаем паузу в 1000мс (1 секунда), для остальных — быстрые 50мс
      const appearanceDelay = (currentStateIndex === 5) ? 1000 : 50;

      setTimeout(() => {
        pizzaCard.src = nextCardSrc;
        pizzaCardOverlay.classList.add('show');
        
        // Таймер автоматического скрытия карточки через 2 секунды обратно вниз
        cardHideTimeout = setTimeout(() => {
          pizzaCardOverlay.classList.remove('show');
        }, 2000);
        
      }, appearanceDelay);
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
    const DAYS_PER_STAGE = 4; // Интервал смены стадий в днях
    const TOTAL_STAGES = 8;   // Всего стадий роста
    const plantImg = document.getElementById("plant");

    if (!plantImg) return;

    // 1. Получаем или инициализируем дату посадки в localStorage
    let plantStartDate = localStorage.getItem("plantStartDate");
    
    if (!plantStartDate) {
        plantStartDate = new Date().toISOString();
        localStorage.setItem("plantStartDate", plantStartDate);
    }

    // 2. Вычисляем разницу в днях между текущей датой и датой посадки
    const start = new Date(plantStartDate);
    const now = new Date();
    const diffTime = Math.max(0, now - start); // Разница в миллисекундах
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Перевод в полные дни

    // 3. Рассчитываем текущую стадию (начиная с 1 до TOTAL_STAGES)
    // Формула: каждые 4 дня стадия увеличивается на 1.
    let currentStage = 1 + Math.floor(diffDays / DAYS_PER_STAGE);
    
    // Ограничиваем максимальной (8-й) стадией
    if (currentStage > TOTAL_STAGES) {
        currentStage = TOTAL_STAGES;
    }

    // 4. Подставляем нужный спрайт растения
    plantImg.src = `assets/flower_states/flower_state${currentStage}.png`;
    plantImg.alt = `Растение — Стадия ${currentStage}`;

    // ДЛЯ ТЕСТИРОВАНИЯ (вывод в консоль браузера)
    console.log(`Прошло дней: ${diffDays}. Текущая стадия растения: ${currentStage}`);
});




const lampBulb = document.getElementById('lamp_bulb');
const lampLight = document.querySelector('.lamp-light');
const lampAudio = document.getElementById('Lamp_audio');

const LAMP_SOUND_VOLUME = 0.05;

if (lampBulb && lampLight) {
    // 1. Временно отключаем transition, чтобы не было затухания на 0.3с
    lampLight.classList.add('no-transition');

    // 2. Проверяем сохраненное состояние
    const savedLampState = localStorage.getItem('lampState');
    if (savedLampState === 'off') {
        lampLight.classList.add('off');
    }

    // 3. Возвращаем transition в следующем кадре анимации
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            lampLight.classList.remove('no-transition');
        });
    });

    // 4. Обработчик клика (здесь анимация уже работает)
    lampBulb.addEventListener('click', () => {
        const isOff = lampLight.classList.toggle('off');
        localStorage.setItem('lampState', isOff ? 'off' : 'on');

        if (lampAudio) {
            lampAudio.volume = LAMP_SOUND_VOLUME;
            lampAudio.currentTime = 0;
            lampAudio.play().catch(err => console.log("Ошибка звука лампы:", err));
        }
    });
}


const jar = document.getElementById('jar');
const jarAudio = document.getElementById('Jar_audio');
const jarBreakAudio = document.getElementById('Jar_break_audio');
const bflyAudio = document.getElementById('Bfly_audio');

jarAudio.volume = 0.3;
jarBreakAudio.volume = 0.5;
bflyAudio.volume = 0.4;

const maxClicks = Math.floor(Math.random() * (7 - 4 + 1)) + 4;
let currentClicks = 0;
let isFalling = false;

const butterflyImages = ['assets/BF1.png', 'assets/BF2.png'];

// --- ПРОВЕРКА: Разбирал ли пользователь банку сегодня ---
const today = new Date().toDateString(); // Например: "Fri Aug 07 2026"
const lastBreakDate = localStorage.getItem('jar_last_break_date');

if (lastBreakDate === today) {
    // Если банка уже разбита сегодня — скрываем её полностью
    jar.style.display = 'none';
}

/**
 * Хаотичный бесконечный полёт бабочки по экрану
 */
function startRandomFlight(bFly) {
    bFly.style.zIndex = '9999';

    const targetX = (10 + Math.random() * 80) * (window.innerWidth / 100);
    const targetY = (10 + Math.random() * 80) * (window.innerHeight / 100);

    const currentLeft = parseFloat(bFly.style.left);
    const currentTop = parseFloat(bFly.style.top);

    const deltaX = targetX - currentLeft;
    const deltaY = targetY - currentTop;
    const angle = Math.atan2(deltaY, deltaX);
    const rotateDeg = (angle + Math.PI / 2) * (180 / Math.PI);

    const duration = 3000 + Math.random() * 3000;

    const anim = bFly.animate([
        { 
            left: `${currentLeft}px`, 
            top: `${currentTop}px`,
            transform: `rotate(${rotateDeg}deg)`
        },
        { 
            left: `${targetX}px`, 
            top: `${targetY}px`,
            transform: `rotate(${rotateDeg}deg)`
        }
    ], {
        duration: duration,
        easing: 'ease-in-out',
        fill: 'forwards'
    });

    anim.onfinish = () => {
        bFly.style.left = `${targetX}px`;
        bFly.style.top = `${targetY}px`;
        startRandomFlight(bFly);
    };
}

/**
 * Массовый вылет бабочек
 */
function createButterflyBurst(x, y, count = 55) {
    const container = document.body;
    const vw = window.innerWidth / 100;

    for (let i = 0; i < count; i++) {
        const bFly = document.createElement('div');
        bFly.className = 'butterfly';

        const img = document.createElement('img');
        img.src = butterflyImages[Math.floor(Math.random() * butterflyImages.length)];
        img.className = 'butterfly-img';
        bFly.appendChild(img);

        bFly.style.left = `${x}px`;
        bFly.style.top = `${y}px`;
        container.appendChild(bFly);

        const scale = 0.5 + Math.random() * 0.9;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.25);
        const dist = (25 + Math.random() * 35) * vw; 
        const deltaX = Math.cos(angle) * dist;
        const deltaY = Math.sin(angle) * dist;

        const baseRotate = (angle + Math.PI / 2) * (180 / Math.PI);
        const turns = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 3));
        const endRotateY = turns * 360;

        const isStaying = i >= (count - 3);

        if (isStaying) {
            bFly.classList.add('staying-butterfly');
        }

        const animation = bFly.animate([
            {
                transform: `translate(0, 0) scale(0) rotate(${baseRotate}deg) rotateY(0deg)`,
                opacity: 0,
                offset: 0
            },
            {
                transform: `translate(0, 0) scale(${scale}) rotate(${baseRotate}deg) rotateY(${endRotateY * 0.1}deg)`,
                opacity: 1,
                offset: 0.1
            },
            {
                transform: `translate(${deltaX * 0.85}px, ${deltaY * 0.85}px) scale(${scale}) rotate(${baseRotate}deg) rotateY(${endRotateY * 0.85}deg)`,
                opacity: 1,
                offset: 0.85
            },
            {
                transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale}) rotate(${baseRotate}deg) rotateY(${endRotateY}deg)`,
                opacity: isStaying ? 1 : 0,
                offset: 1
            }
        ], {
            duration: 4000 + Math.random() * 1500,
            easing: 'ease-out',
            fill: 'forwards'
        });

        animation.onfinish = () => {
            if (isStaying) {
                bFly.style.left = `${x + deltaX}px`;
                bFly.style.top = `${y + deltaY}px`;
                startRandomFlight(bFly);
            } else {
                bFly.remove();
            }
        };
    }
}

// Обработка кликов по банке
jar.addEventListener('click', () => {
    if (isFalling) return;

    currentClicks++;

    if (currentClicks >= maxClicks) {
        isFalling = true;

        // СОХРАНЯЕМ ДАТУ: заносим сегодняшнее число в память браузера
        localStorage.setItem('jar_last_break_date', new Date().toDateString());

        jar.style.zIndex = '-1';
        jar.style.pointerEvents = 'none';

        jar.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: 'translateY(5vh) rotate(30deg)', opacity: 1, offset: 0.2 },
            { transform: 'translateY(110vh) rotate(180deg)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-in',
            fill: 'forwards'
        });

        setTimeout(() => {
            jarBreakAudio.currentTime = 0;
            jarBreakAudio.play();

            bflyAudio.currentTime = 0;
            bflyAudio.loop = true;
            bflyAudio.volume = 0.4;
            bflyAudio.play();

            const jarRect = jar.getBoundingClientRect();
            const bottomX = jarRect.left + jarRect.width / 2;
            const bottomY = window.innerHeight * 0.85;

            createButterflyBurst(bottomX, bottomY, 55);

            setTimeout(() => {
                let fadeInterval = setInterval(() => {
                    if (bflyAudio.volume > 0.05) {
                        bflyAudio.volume -= 0.05;
                    } else {
                        clearInterval(fadeInterval);
                        bflyAudio.pause();
                        bflyAudio.loop = false;
                    }
                }, 100);
            }, 4000);

        }, 600);

    } else {
        jarAudio.currentTime = 0;
        jarAudio.play();

        jar.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(-8deg)' },
            { transform: 'rotate(6deg)' },
            { transform: 'rotate(-4deg)' },
            { transform: 'rotate(0deg)' }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
    }
});

// === ЛОГИКА ОКНА ЛУНЫ И СКАЗОК ===
document.addEventListener('DOMContentLoaded', () => {
  const moonBtn = document.getElementById('moon');
  const moonOverlay = document.getElementById('moon-modal-overlay');

  // Укажи здесь точные пути и имена файлов сказок из папки audio/Moon/
  const fairyTalesList = [
  'audio/Moon/1.ogg',
  'audio/Moon/2.ogg',
  'audio/Moon/3.ogg',
  'audio/Moon/4.ogg',
  'audio/Moon/5.ogg',
  'audio/Moon/6.ogg',
  'audio/Moon/7.ogg'
  ];

  let currentStoryAudio = null;
  let storyTimeoutId = null;
  let fadeIntervalId = null;

  // Функция плавной смены громкости
  function fadeVolume(audio, targetVolume, duration = 2000, onComplete = null) {
    if (fadeIntervalId) clearInterval(fadeIntervalId);
    const startVolume = audio.volume;
    const steps = 30;
    const stepTime = duration / steps;
    const volumeChange = (targetVolume - startVolume) / steps;
    let currentStep = 0;

    fadeIntervalId = setInterval(() => {
      currentStep++;
      const newVol = startVolume + (volumeChange * currentStep);
      audio.volume = Math.min(1, Math.max(0, newVol));

      if (currentStep >= steps) {
        clearInterval(fadeIntervalId);
        audio.volume = targetVolume;
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  // Приглушение/восстановление остальных звуков на странице
  function setOtherAudioVolume(isDumbed) {
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      if (audio !== currentStoryAudio) {
        if (!audio.dataset.originalVolume) {
          audio.dataset.originalVolume = audio.volume || 0.1;
        }
        const baseVol = parseFloat(audio.dataset.originalVolume);
        // В 5 раз тише (умножаем на 0.2)
        audio.volume = isDumbed ? baseVol * 0.2 : baseVol;
      }
    });
  }

  // Выбор сказки дня (1 сказка на дату)
  function getDailyFairyTale() {
    if (!fairyTalesList.length) return null;
    
    const today = new Date().toISOString().split('T')[0]; // Формат YYYY-MM-DD
    const savedDate = localStorage.getItem('moon_story_date');
    const savedStory = localStorage.getItem('moon_story_path');

    if (savedDate === today && savedStory && fairyTalesList.includes(savedStory)) {
      return savedStory;
    }

    const randomIndex = Math.floor(Math.random() * fairyTalesList.length);
    const selectedStory = fairyTalesList[randomIndex];

    localStorage.setItem('moon_story_date', today);
    localStorage.setItem('moon_story_path', selectedStory);

    return selectedStory;
  }

  // Остановка сказки и закрытие окна
  function stopFairyTale() {
    if (storyTimeoutId) {
      clearTimeout(storyTimeoutId);
      storyTimeoutId = null;
    }

    setOtherAudioVolume(false); // Возвращаем громкость остальным звукам

    if (currentStoryAudio) {
      fadeVolume(currentStoryAudio, 0, 1000, () => {
        currentStoryAudio.pause();
        currentStoryAudio.currentTime = 0;
      });
    }
  }

  if (moonBtn && moonOverlay) {
    // Открытие окна по клику на луну
    moonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moonOverlay.classList.add('moon-modal-active');

      const storyPath = getDailyFairyTale();
      if (!storyPath) return;

      // Запуск сказки через 3 секунды
      storyTimeoutId = setTimeout(() => {
        if (!moonOverlay.classList.contains('moon-modal-active')) return;

        setOtherAudioVolume(true); // Все остальные звуки становятся в 5 раз тише

        currentStoryAudio = new Audio(storyPath);
        currentStoryAudio.volume = 0;
        
        // Автоматическое закрытие меню при окончании аудио
        currentStoryAudio.onended = () => {
          moonOverlay.classList.remove('moon-modal-active');
          stopFairyTale();
        };

        currentStoryAudio.play().then(() => {
          // Плавный разгон громкости от 0 до 0.15
          fadeVolume(currentStoryAudio, 0.5, 2500);
        }).catch(err => console.log("Автовоспроизведение заблокировано браузером:", err));

      }, 3000);
    });

    // Закрытие при клике по фону
    moonOverlay.addEventListener('click', (e) => {
      if (e.target === moonOverlay || e.target.classList.contains('moon-modal-content')) {
        moonOverlay.classList.remove('moon-modal-active');
        stopFairyTale();
      }
    });

    // Закрытие по клавише Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && moonOverlay.classList.contains('moon-modal-active')) {
        moonOverlay.classList.remove('moon-modal-active');
        stopFairyTale();
      }
    });
  }
});
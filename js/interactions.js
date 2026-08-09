const pizza = document.getElementById('pizza');
const tomato = document.getElementById('tomato');
const pizzaCardOverlay = document.getElementById('pizzaCardOverlay');
const pizzaCard = document.getElementById('pizzaCard');
const pizzaAudio = document.getElementById('Pizza_audio');

const PIZZA_SOUND_VOLUME = 0.03;
const TOMATO_CHANCE = 0.20;

// Проверка первого визита в браузере
const hasVisitedBefore = localStorage.getItem('cozy_room_visited');
let isTomatoSpawned = false;

if (!hasVisitedBefore) {
  // На первый визит фиксируем заход и всегда ставим пиццу
  localStorage.setItem('cozy_room_visited', 'true');
  isTomatoSpawned = false;
} else {
  // На повторные визиты — обычный 20% шанс
  isTomatoSpawned = Math.random() < TOMATO_CHANCE;
}

let cardHideTimeout;

// Функция воспроизведения звука
function playBiteSound() {
  if (pizzaAudio) {
    pizzaAudio.volume = PIZZA_SOUND_VOLUME;
    pizzaAudio.currentTime = 0;
    pizzaAudio.play().catch(err => console.log("Ошибка воспроизведения звука:", err));
  }
}

// Функция показа записки (для пиццы и томатов)
function showCard(cardSrc, delay) {
  if (!cardSrc) return;
  
  clearTimeout(cardHideTimeout);
  pizzaCardOverlay.classList.remove('show');

  setTimeout(() => {
    pizzaCard.src = cardSrc;
    pizzaCardOverlay.classList.add('show');
    
    cardHideTimeout = setTimeout(() => {
      pizzaCardOverlay.classList.remove('show');
    }, 2000);
  }, delay);
}

// === ЛОГИКА ВЫБОРА: ПИЦЦА ИЛИ ПОМИДОР ===
if (isTomatoSpawned && tomato) {
  // Убираем пиццу, показываем помидор
  if (pizza) pizza.remove();
  tomato.style.display = 'block';

  const tomatoStates = [
    'assets/tomato_states/tomato_state-1.png',
    'assets/tomato_states/tomato_state-2.png',
    'assets/tomato_states/tomato_state-3.png',
    'assets/tomato_states/tomato_state-4.png'
  ];

  let currentTomatoIndex = 0;
  tomato.src = tomatoStates[currentTomatoIndex];

  tomato.addEventListener('click', () => {
    playBiteSound();

    currentTomatoIndex++;

    if (currentTomatoIndex >= tomatoStates.length) {
      // 4-й клик: помидор полностью съеден
      tomato.remove();
    } else {
      tomato.src = tomatoStates[currentTomatoIndex];
    }

    // Записки для томата
    let nextCardSrc = null;
    switch (currentTomatoIndex) {
      case 1:
        nextCardSrc = 'assets/tomato_states/note_1.png'; // Первый укус
        break;
      case 4:
        nextCardSrc = 'assets/tomato_states/note-2.png'; // Последний укус
        break;
    }

    const appearanceDelay = (currentTomatoIndex === 4) ? 1000 : 50;
    showCard(nextCardSrc, appearanceDelay);
  });

} else if (pizza) {
  // Иначе показываем пиццу, помидор удаляем
  if (tomato) tomato.remove();

  const pizzaStates = [
    'assets/pizza_states/pizza_state1.png',
    'assets/pizza_states/pizza_state2.png',
    'assets/pizza_states/pizza_state3.png',
    'assets/pizza_states/pizza_state4.png',
    'assets/pizza_states/pizza_state5.png'
  ];

  let currentPizzaIndex = 0;
  pizza.src = pizzaStates[currentPizzaIndex];

  pizza.addEventListener('click', () => {
    playBiteSound();

    currentPizzaIndex++;

    if (currentPizzaIndex >= pizzaStates.length) {
      pizza.remove();
    } else {
      pizza.src = pizzaStates[currentPizzaIndex];
    }

    let nextCardSrc = null;
    switch (currentPizzaIndex) {
      case 1:
        nextCardSrc = 'assets/pizza_states/card1.png';
        break;
      case 2:
        nextCardSrc = 'assets/pizza_states/card2.png';
        break;
      case 3:
        nextCardSrc = null;
        break;
      case 4:
        nextCardSrc = 'assets/pizza_states/card3.png';
        break;
      case 5:
        nextCardSrc = 'assets/pizza_states/card4.png';
        break;
    }

    const appearanceDelay = (currentPizzaIndex === 5) ? 1000 : 50;
    showCard(nextCardSrc, appearanceDelay);
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

const comb = document.getElementById('comb');
const spiderContainer = document.getElementById('spiderContainer');
const spider = document.getElementById('spider');
const spiderSign = document.getElementById('spiderSign');

const spiderHoverAudio = document.getElementById('Spider_hover_audio');
const spiderClickAudio = document.getElementById('Spider_click_audio');

// Настройка громкости
if (jarAudio) jarAudio.volume = 0.07;
if (jarBreakAudio) jarBreakAudio.volume = 0.1;
if (bflyAudio) bflyAudio.volume = 0.4;

if (spiderHoverAudio) spiderHoverAudio.volume = 0.07; // Тихий "вопросительный" бип
if (spiderClickAudio) spiderClickAudio.volume = 0.3; // Громкий бип при клике

const maxClicks = Math.floor(Math.random() * (7 - 4 + 1)) + 4;
let currentClicks = 0;
let isFalling = false;
let spiderSignTimer = null;

const butterflyImages = ['assets/BF1.png', 'assets/BF2.png'];

// --- ПРОВЕРКА: Разбирал ли пользователь банку сегодня ---
const today = new Date().toDateString();
const lastBreakDate = localStorage.getItem('jar_last_break_date');

if (lastBreakDate === today) {
    // Банка уже разбита сегодня — скрываем её
    if (jar) jar.style.display = 'none';

    // 30% шанс на появление пасхалки
    const EASTER_EGG_CHANCE = 0.30;
    if (Math.random() < EASTER_EGG_CHANCE) {
        // Выбираем строго одно: ИЛИ расчёска (comb), ИЛИ паук (spider)
        const chosenEgg = Math.random() < 0.5 ? 'comb' : 'spider';

        if (chosenEgg === 'comb' && comb) {
            comb.style.display = 'block';
        } else if (chosenEgg === 'spider' && spiderContainer) {
            spiderContainer.style.display = 'flex';
        }
    }
}

// --- ИНТЕРАКТИВ БОТА-ПАУЧКА ---
if (spiderContainer && spider && spiderSign) {
    // 1. Воспроизведение звука при наведении
    spiderContainer.addEventListener('mouseenter', () => {
        if (spiderHoverAudio) {
            spiderHoverAudio.currentTime = 0;
            spiderHoverAudio.play().catch(err => console.log("Ошибка звука hover:", err));
        }
    });

    // 2. Клик по паучку: громкий бип, появление ! и сброс на ? через 2 сек
    spider.addEventListener('click', () => {
        if (spiderClickAudio) {
            spiderClickAudio.currentTime = 0;
            spiderClickAudio.play().catch(err => console.log("Ошибка звука click:", err));
        }

        spiderSign.textContent = '!';

        spiderSign.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.4)' },
            { transform: 'scale(1)' }
        ], { duration: 200 });

        if (spiderSignTimer) {
            clearTimeout(spiderSignTimer);
        }

        spiderSignTimer = setTimeout(() => {
            spiderSign.textContent = '?';
        }, 2000);
    });
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

// --- ОБРАБОТКА КЛИКОВ ПО БАНКЕ ---
if (jar) {
    jar.addEventListener('click', () => {
        if (isFalling) return;

        currentClicks++;

        if (currentClicks >= maxClicks) {
            isFalling = true;

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
                if (jarBreakAudio) {
                    jarBreakAudio.currentTime = 0;
                    jarBreakAudio.play();
                }

                if (bflyAudio) {
                    bflyAudio.currentTime = 0;
                    bflyAudio.loop = true;
                    bflyAudio.volume = 0.4;
                    bflyAudio.play();
                }

                const jarRect = jar.getBoundingClientRect();
                const bottomX = jarRect.left + jarRect.width / 2;
                const bottomY = window.innerHeight * 0.85;

                createButterflyBurst(bottomX, bottomY, 55);

                setTimeout(() => {
                    let fadeInterval = setInterval(() => {
                        if (bflyAudio && bflyAudio.volume > 0.05) {
                            bflyAudio.volume -= 0.05;
                        } else {
                            clearInterval(fadeInterval);
                            if (bflyAudio) {
                                bflyAudio.pause();
                                bflyAudio.loop = false;
                            }
                        }
                    }, 100);
                }, 4000);

            }, 600);

        } else {
            if (jarAudio) {
                jarAudio.currentTime = 0;
                jarAudio.play();
            }

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
}

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



const dreamcatcher = document.getElementById('dreamcatcher');
const DREAMCATCHER_CHANCE = 0.15; // Поставь 1.0 для теста

// Используем уникальное имя переменной, чтобы не было конфликта
const isFirstVisit = !localStorage.getItem('cozy_room_visited');

if (dreamcatcher) {
  if (isFirstVisit) {
    // При первом визите ловец НЕ появляется, но фиксируем посещение
    localStorage.setItem('cozy_room_visited', 'true');
    dreamcatcher.style.display = 'none';
  } else {
    // При последующих визитах проверяем шанс
    const isDreamcatcherSpawned = Math.random() < DREAMCATCHER_CHANCE;

    if (isDreamcatcherSpawned) {
      dreamcatcher.style.display = 'block';
    } else {
      dreamcatcher.style.display = 'none';
    }
  }
}


const gamepad = document.getElementById('gamepad');
const xboxAudio = document.getElementById('xbox_360_audio');
const GAMEPAD_CHANCE = 0.20; // 10% шанс появления

const isGamepadFirstVisit = !localStorage.getItem('cozy_room_visited');

if (gamepad) {
  if (isGamepadFirstVisit) {
    // На первый запуск 100% скрыт
    gamepad.style.display = 'none';
  } else {
    // На повторные заходы проверяем 10% шанс
    const isGamepadSpawned = Math.random() < GAMEPAD_CHANCE;

    if (isGamepadSpawned) {
      gamepad.style.display = 'block';
    } else {
      gamepad.style.display = 'none';
    }
  }

  // Обработчик клика (сработает, если геймпад появился)
  gamepad.addEventListener('click', () => {
    if (xboxAudio) {
      xboxAudio.volume = 0.25;
      xboxAudio.currentTime = 0;
      xboxAudio.play().catch(err => console.log("Ошибка звука геймпада:", err));
    }

    gamepad.classList.add('evaporate');

    setTimeout(() => {
      gamepad.remove();
    }, 500);
  });
}


const dino = document.getElementById('dino');
const dinoScroll = document.getElementById('dino-scroll');
const SCROLL_CHANCE = 0.15; // 15% шанс

const isDinoFirstVisit = !localStorage.getItem('cozy_room_visited');

if (dino && dinoScroll) {
  if (isDinoFirstVisit) {
    // При первом визите — всегда динозавр
    dino.style.display = 'block';
    dinoScroll.style.display = 'none';
  } else {
    // При повторных визитах проверяем шанс
    const isScrollSpawned = Math.random() < SCROLL_CHANCE;

    if (isScrollSpawned) {
      dino.style.display = 'none';
      dinoScroll.style.display = 'block';
    } else {
      dino.style.display = 'block';
      dinoScroll.style.display = 'none';
    }
  }

  // Обработчик клика по свитку
  dinoScroll.addEventListener('click', () => {
    console.log("Клик по свитку динозавра");
  });
}



const magicStick = document.getElementById('magicStick');
const magicStickAudio = document.getElementById('Magic_stick_sound');
const MAGIC_STICK_CHANCE = 0.15;

const isStickFirstVisit = !localStorage.getItem('cozy_room_visited');

if (magicStick) {
  if (isStickFirstVisit) {
    magicStick.style.display = 'none';
  } else {
    const isStickSpawned = Math.random() < MAGIC_STICK_CHANCE;
    magicStick.style.display = isStickSpawned ? 'block' : 'none';
  }

  magicStick.addEventListener('click', () => {
    // 1. Воспроизводим звук с громкостью 10% (0.10)
    if (magicStickAudio) {
      magicStickAudio.volume = 0.10;
      magicStickAudio.currentTime = 0;
      magicStickAudio.play().catch(err => console.log("Ошибка воспроизведения звука палочки:", err));
    }

    // 2. Вычисляем координаты (кончик палочки, смещен левее)
    const rect = magicStick.getBoundingClientRect();
    const tipX = rect.left + (rect.width * 0.25);
    const tipY = rect.top;

    // 3. Запускаем искры и анимацию исчезновения
    createSparkBurst(tipX, tipY);
    magicStick.classList.add('vanish');

    setTimeout(() => {
      magicStick.remove();
    }, 300);
  });
}

function createSparkBurst(originX, originY) {
  const sparkCount = 120; // Увеличено количество искр (было 30)

  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'magic-spark';

    const angle = Math.random() * Math.PI * 2;
    // Увеличена дальность разлета: от 100px до 280px (было 40-120px)
    const distance = 200 + Math.random() * 180; 

    const dx = `${Math.cos(angle) * distance}px`;
    const dy = `${Math.sin(angle) * distance}px`;

    spark.style.setProperty('--dx', dx);
    spark.style.setProperty('--dy', dy);

    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;

    // Разные размеры искорок для пышности эффекта
    const size = 3 + Math.random() * 7;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;

    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 800);
  }
}



const chocolate = document.getElementById('chocolate');
const chocolateSpeech = document.getElementById('chocolateSpeech');
const chocoEatAudio = document.getElementById('Pizza_audio');

const CHOCOLATE_CHANCE = 0.2; // 20% шанс появления (поставь 1.0 для теста)
const isChocolateFirstVisit = !localStorage.getItem('cozy_room_visited');

if (chocolate && chocolateSpeech) {
  // Настройка первого посещения и спавна
  if (isChocolateFirstVisit) {
    chocolate.style.display = 'none';
  } else {
    const isChocolateSpawned = Math.random() < CHOCOLATE_CHANCE;
    chocolate.style.display = isChocolateSpawned ? 'block' : 'none';
  }

  // Начальное состояние облачка
  chocolateSpeech.style.display = 'none';
  chocolateSpeech.classList.add('pop-hidden');

  chocolate.addEventListener('click', () => {
    // 1. Воспроизводим звук съедания (громкость 0.25, как у пиццы/помидора)
    if (chocoEatAudio) {
      chocoEatAudio.volume = 0.25;
      chocoEatAudio.currentTime = 0;
      chocoEatAudio.play().catch(err => console.log("Ошибка воспроизведения звука:", err));
    }

    // 2. Шоколадка мгновенно исчезает
    chocolate.style.display = 'none';

    // 3. Через 1 секунду появляется облачко из рта мишки
    setTimeout(() => {
      chocolateSpeech.style.display = 'block';
      chocolateSpeech.classList.add('pop-hidden');
      chocolateSpeech.classList.remove('pop-visible');

      // Форсируем применение начальных стилей для срабатывания анимации
      void chocolateSpeech.offsetWidth;

      // Плавно разворачиваем облачко
      chocolateSpeech.classList.remove('pop-hidden');
      chocolateSpeech.classList.add('pop-visible');

      // 4. Через 4 секунды запускаем анимацию скрытия
      setTimeout(() => {
        chocolateSpeech.classList.remove('pop-visible');
        chocolateSpeech.classList.add('pop-hidden');

        // Скрываем элемент из DOM после завершения переходы (400мс)
        setTimeout(() => {
          chocolateSpeech.style.display = 'none';
        }, 400);
      }, 4000);

    }, 1000);
  });
}

const ears = document.getElementById('ears');

const EARS_CHANCE = 0.10; // 10% шанс появления (поставь 1.0 для теста)
const isEarsFirstVisit = !localStorage.getItem('cozy_room_visited');

if (ears) {
  // 1. Проверка первого посещения и спавна
  if (isEarsFirstVisit) {
    ears.style.display = 'none';
  } else {
    const isEarsSpawned = Math.random() < EARS_CHANCE;
    ears.style.display = isEarsSpawned ? 'block' : 'none';
  }

  // 2. Реакция на клик: анимация шевеления ушек
  ears.addEventListener('click', () => {
    // Сбрасываем класс, если анимация уже идет
    ears.classList.remove('ears-twitch');
    void ears.offsetWidth; // Форсируем reflow для перезапуска
    ears.classList.add('ears-twitch');

    // Удаляем класс после завершения анимации (400 мс)
    setTimeout(() => {
      ears.classList.remove('ears-twitch');
    }, 400);
  });
}


(function initFoxEarsNote() {
    const ears = document.getElementById('ears');
    const foxNote = document.getElementById('fox-note');

    if (!ears || !foxNote) return;

    // Функция показа записки
    function showNote() {
        foxNote.classList.remove('fade-out-note');
        foxNote.style.display = 'block';
        foxNote.classList.add('fade-in-note');
    }

    // Функция скрытия записки
    function hideNote() {
        foxNote.classList.remove('fade-in-note');
        foxNote.classList.add('fade-out-note');
        
        setTimeout(() => {
            foxNote.style.display = 'none';
            foxNote.classList.remove('fade-out-note');
        }, 200);
    }

    // Клик по ушкам — переключаем записку
    ears.addEventListener('click', (e) => {
        e.stopPropagation();
        if (foxNote.style.display === 'none' || foxNote.style.display === '') {
            showNote();
        } else {
            hideNote();
        }
    });

    // Клик по самой записке — закрывает её
    foxNote.addEventListener('click', (e) => {
        e.stopPropagation();
        hideNote();
    });
})();



// Используем изолированную функцию, чтобы не ломать чужие переменные
(function initCozyChanger() {
    const catContainer = document.getElementById('catContainer');
    const bear = document.getElementById('bear');
    const loveLetter = document.getElementById('love-letter');
    const gamepad = document.getElementById('gamepad');
    const chocolate = document.getElementById('chocolate');

    if (!catContainer) return;

    // Уникальный ключ посещения для этой механики
    const VISIT_KEY = 'cozy_room_cat_letter_visited';
    const isFirstVisit = !localStorage.getItem(VISIT_KEY);

    // При первом визите — кот на месте, медведь на месте, письма нет
    if (isFirstVisit) {
        localStorage.setItem(VISIT_KEY, 'true');
        catContainer.classList.add('cat-default-pos');
        if (bear) bear.style.display = 'block';
        if (loveLetter) loveLetter.style.display = 'none';
        return;
    }

    // Шансы появления (настрой под себя)
    const CAT_IN_CHAIR_CHANCE = 0.1; // 15% шанс
    const GAMEPAD_CHANCE = 0.25;
    const CHOCOLATE_CHANCE = 0.20;

    // Сбрасываем позиционные классы кота
    catContainer.classList.remove('cat-default-pos', 'cat-chair-pos');

    const isCatInChair = Math.random() < CAT_IN_CHAIR_CHANCE;

    if (isCatInChair) {
        // === КОТ ПЕРЕСЕЛ В КРЕСЛО ===
        catContainer.classList.add('cat-chair-pos'); // Кот уходит в кресло
        if (bear) bear.style.display = 'none';        // Медведь пропадает
        if (loveLetter) loveLetter.style.display = 'block'; // ПИСЬМО ПОЯВЛЯЕТСЯ на старом месте кота

        // Геймпад и шоколадка НЕ спавнятся
        if (gamepad) gamepad.style.display = 'none';
        if (chocolate) chocolate.style.display = 'none';

    } else {
        // === КОТ НА ОБЫЧНОМ МЕСТЕ ===
        catContainer.classList.add('cat-default-pos'); // Кот на дефолтном месте
        if (bear) bear.style.display = 'block';        // Медведь в кресле
        if (loveLetter) loveLetter.style.display = 'none'; // Письма нет

        // Обычный спавн предметов
        if (gamepad) {
            gamepad.style.display = Math.random() < GAMEPAD_CHANCE ? 'block' : 'none';
        }
        if (chocolate) {
            chocolate.style.display = Math.random() < CHOCOLATE_CHANCE ? 'block' : 'none';
        }
    }
})();


(function initCameraEasterEgg() {
    const camera = document.getElementById('camera');
    const yarnsContainer = document.querySelector('.yarns-container');
    const flashOverlay = document.getElementById('flash-overlay');
    const cameraAudio = document.getElementById('camera_click_audio');

    if (!camera || !yarnsContainer) return;

    const VISIT_KEY = 'cozy_room_camera_visited';
    const isFirstVisit = !localStorage.getItem(VISIT_KEY);

    // В первый запуск пасхалка гарантированно не появляется
    if (isFirstVisit) {
        localStorage.setItem(VISIT_KEY, 'true');
        camera.style.display = 'none';
        yarnsContainer.style.display = 'block';
        return;
    }

    const CAMERA_CHANCE = 0.10; // 10% шанс появления камеры вместо пряжи
    const isCameraSpawned = Math.random() < CAMERA_CHANCE;

    if (isCameraSpawned) {
        camera.style.display = 'block';
        yarnsContainer.style.display = 'none';
    } else {
        camera.style.display = 'none';
        yarnsContainer.style.display = 'block';
    }

    // Клик по фотоаппарату: звук затвора, вспышка и исчезновение
    camera.addEventListener('click', () => {
        // Проигрываем звук затвора
        if (cameraAudio) {
            cameraAudio.currentTime = 0;
            cameraAudio.play().catch(err => console.log("Ошибка аудио камеры:", err));
        }

        if (flashOverlay) {
            flashOverlay.classList.remove('fade-out');
            flashOverlay.classList.add('active');

            setTimeout(() => {
                // Фотоаппарат исчезает в момент белого экрана
                camera.style.display = 'none';

                // Плавно гасим белое свечение
                flashOverlay.classList.remove('active');
                flashOverlay.classList.add('fade-out');
            }, 100);
        } else {
            camera.style.display = 'none';
        }
    });
})();


(function initGiantPlantEasterEgg() {
    const plant = document.getElementById('plant');
    const wtfNote = document.getElementById('wtf-note');
    const flowerContainer = plant ? plant.closest('.flower-container') : null;

    if (!plant) return;

    const VISIT_KEY = 'cozy_room_giant_plant_visited';
    const isFirstVisit = !localStorage.getItem(VISIT_KEY);

    if (isFirstVisit) {
        localStorage.setItem(VISIT_KEY, 'true');
        return;
    }

    const GIANT_PLANT_CHANCE = 0.02; // 5% шанс
    const isGiantSpawned = Math.random() < GIANT_PLANT_CHANCE;

    if (isGiantSpawned) {
        const GIANT_SRC = 'assets/giant-plant.png';

        plant.src = GIANT_SRC;
        plant.classList.add('giant-plant');

        // Отключаем кликабельность цветка
        plant.classList.remove('clickable');
        if (flowerContainer) {
            flowerContainer.classList.remove('clickable');
        }

        // Защита от перетирания картинки
        Object.defineProperty(plant, 'src', {
            get: function() { return GIANT_SRC; },
            set: function(val) {},
            configurable: true
        });

        // ПОКАЗЫВАЕМ ЗАПИСКУ
        if (wtfNote) {
            wtfNote.style.display = 'block';

            // Обработка клика с анимацией исчезновения
            wtfNote.addEventListener('click', () => {
                wtfNote.classList.add('pop-out');
                
                // Полностью скрываем из DOM после завершения анимации
                setTimeout(() => {
                    wtfNote.style.display = 'none';
                }, 350);
            }, { once: true });
        }
    }
})();


(function initDinoScrollNote() {
    const dinoScroll = document.getElementById('dino-scroll');
    const dinoOverlay = document.getElementById('dino-note-overlay');
    const albumAudio = document.getElementById('Album_audio');

    if (!dinoScroll || !dinoOverlay) return;

    // Воспроизведение звука листания/бумаги
    function playNoteSound() {
        if (albumAudio) {
            albumAudio.currentTime = 0;
            albumAudio.play().catch(err => console.log("Ошибка звука:", err));
        }
    }

    // Открытие модалки
    dinoScroll.addEventListener('click', () => {
        playNoteSound();
        dinoOverlay.style.display = 'flex';
        // Небольшой таймаут для работы CSS-перехода opacity
        setTimeout(() => {
            dinoOverlay.classList.add('active');
        }, 10);
    });

    // Закрытие модалки при клике на любое место оверлея или картинку
    dinoOverlay.addEventListener('click', () => {
        playNoteSound();
        dinoOverlay.classList.remove('active');
        
        setTimeout(() => {
            dinoOverlay.style.display = 'none';
        }, 300);
    });
})();
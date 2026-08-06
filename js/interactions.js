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
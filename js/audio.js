




// Объект 1: Динозавр (Звук при НАЖАТИИ)
const obj1 = document.getElementById('dino');
const audio1 = document.getElementById('R-R-R');
audio1.volume = 0.4;

obj1.addEventListener('click', () => {
  audio1.currentTime = 0;
  audio1.play().catch(error => {
    console.log('Звук динозавра не воспроизведен:', error);
  });
});

// Объект 2: Кот (Звук при НАЖАТИИ)
const obj2 = document.getElementById('cat');
const audio2 = document.getElementById('Mr-Mr-Mr');
audio2.volume = 0.05;

obj2.addEventListener('click', () => {
  audio2.currentTime = 0;
  audio2.play().catch(error => {
    console.log('Звук кота не воспроизведен:', error);
  });
});


const duck = document.getElementById("duck");
const duckSound = document.getElementById("duckSound");
duckSound.volume = 0.04;
duck.addEventListener("click", () => {

    // Запускаем анимацию заново
    duck.classList.remove("pressed");
    void duck.offsetWidth;
    duck.classList.add("pressed");

    // Проигрываем звук
    duckSound.currentTime = 0;
    duckSound.play();

});



// Ищем элемент по вашему новому ID
const audio = document.getElementById('BG');

if (audio) {
    const NORMAL_VOLUME = 0.02; // Исходная громкость фона
    audio.volume = NORMAL_VOLUME; 

    // Включаем воспроизведение по первому клику на странице
    document.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(err => console.log("Ошибка воспроизведения:", err));
        }
    }, { once: true });

    let bgFadeInterval;

    // Вспомогательная функция плавного изменения громкости для фоновой музыки
    function fadeBGAudio(targetVolume, duration = 1000) {
        clearInterval(bgFadeInterval);
        
        const step = 0.002; // Плавный маленький шаг
        const stepsCount = duration / 20;
        const volStep = (targetVolume - audio.volume) / stepsCount;

        bgFadeInterval = setInterval(() => {
            let newVol = audio.volume + volStep;

            if ((volStep > 0 && newVol >= targetVolume) || (volStep < 0 && newVol <= targetVolume)) {
                audio.volume = targetVolume;
                clearInterval(bgFadeInterval);
            } else {
                audio.volume = Math.max(0, Math.min(1, newVol));
            }
        }, 20);
    }

    // Реакция на открытие плеера — глушим фоновую музыку до 0
    window.addEventListener('playerOpened', () => {
        fadeBGAudio(0, 1000); // Плавно за 1 секунду
    });

    // Реакция на закрытие плеера — возвращаем громкость 0.02
    window.addEventListener('playerClosed', () => {
        fadeBGAudio(NORMAL_VOLUME, 1000); // Плавно возвращаем за 1 секунду
    });
}




// Изолируем код в блок {}, чтобы переменные не конфликтовали с другими скриптами
{
  // ГРОМКОСТЬ: Настройка от 0.0 (тишина) до 1.0 (максимум)
  const ALBUM_SOUND_VOLUME = 0.012; 

  // Уникальные префиксы для переменных, чтобы избежать совпадений
  const albumClickableElements = document.querySelectorAll('.clickable');
  const albumAudio = document.getElementById('hover-audio');

  if (albumAudio) {
    // Устанавливаем громкость при загрузке скрипта
    albumAudio.volume = ALBUM_SOUND_VOLUME;

    albumClickableElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        albumAudio.currentTime = 0; // Сброс на начало
        
        // Запуск воспроизведения
        albumAudio.play().catch(error => {
          console.warn("Звук заблокирован политикой браузера. Нужен клик по странице:", error);
        });
      });
    });
  }
}

const introScreen = document.getElementById("introScreen");

introScreen.addEventListener("click", () => {

    // Запускаем исчезновение вступительного экрана
    introScreen.classList.add("hide");

    // Через время после анимации полностью убираем его
    setTimeout(() => {

        introScreen.remove();

    }, 800);

});
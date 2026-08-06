let devMode = false;

let selected = null;
let offsetX = 0;
let offsetY = 0;


// включение F2
document.addEventListener("keydown", (e) => {

    if (e.key === "F2") {

        e.preventDefault();

        devMode = !devMode;

        document.body.classList.toggle("dev-mode", devMode);

        console.log(
            devMode
                ? "🛠 Режим разработчика включен"
                : "✅ Режим разработчика выключен"
        );
    }
});


// все предметы
document.querySelectorAll(".object").forEach(obj => {

    obj.dataset.scale = "1";
    obj.dataset.rotate = "0";

    obj.addEventListener("mousedown", (e) => {

        if (!devMode) return;

        selected = obj;

        let rect = obj.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        obj.style.zIndex = 999;

    });

});


// движение мыши
document.addEventListener("mousemove", (e) => {

    if (!selected || !devMode)
        return;

    const room = document.getElementById("room");

    const roomRect = room.getBoundingClientRect(); 

    let x = e.clientX - offsetX - roomRect.left;
    let y = e.clientY - offsetY - roomRect.top;

    let leftPercent = x / roomRect.width * 100;
    let topPercent = y / roomRect.height * 100;

    selected.style.left = leftPercent + "%";
    selected.style.top = topPercent + "%";

});


// отпускание
document.addEventListener("mouseup", () => {

    if (selected) {

        selected.style.zIndex = "";

        console.log(`
#${selected.id}

left: ${selected.style.left};
top: ${selected.style.top};
scale: ${selected.dataset.scale};
rotate: ${selected.dataset.rotate}deg;
        `);
    }

    selected = null;

});


// управление клавиатурой
document.addEventListener("keydown", (e) => {

    if (!devMode || !selected) return;

    let step = e.shiftKey ? 10 : 1;

    let left = parseFloat(selected.style.left) || selected.offsetLeft;
    let top = parseFloat(selected.style.top) || selected.offsetTop;

    switch (e.key) {

        case "ArrowLeft":
            selected.style.left = (left - step) + "px";
            break;

        case "ArrowRight":
            selected.style.left = (left + step) + "px";
            break;

        case "ArrowUp":
            selected.style.top = (top - step) + "px";
            break;

        case "ArrowDown":
            selected.style.top = (top + step) + "px";
            break;

        case "+":
        case "=":
        {
            let scale = parseFloat(selected.dataset.scale);
            scale += 0.02;

            selected.dataset.scale = scale;

            selected.style.transform =
                `scale(${scale}) rotate(${selected.dataset.rotate}deg)`;

            break;
        }

        case "-":
        {
            let scale = parseFloat(selected.dataset.scale);
            scale = Math.max(0.1, scale - 0.02);

            selected.dataset.scale = scale;

            selected.style.transform =
                `scale(${scale}) rotate(${selected.dataset.rotate}deg)`;

            break;
        }

        case "q":
        case "Q":
        {
            let rot = parseFloat(selected.dataset.rotate);
            rot -= 2;

            selected.dataset.rotate = rot;

            selected.style.transform =
                `scale(${selected.dataset.scale}) rotate(${rot}deg)`;

            break;
        }

        case "e":
        case "E":
        {
            let rot = parseFloat(selected.dataset.rotate);
            rot += 2;

            selected.dataset.rotate = rot;

            selected.style.transform =
                `scale(${selected.dataset.scale}) rotate(${rot}deg)`;

            break;
        }

    }

});
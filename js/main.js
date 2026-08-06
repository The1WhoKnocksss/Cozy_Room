const dustContainer = document.querySelector(".dust-container");

for(let i = 0; i < 40; i++){
    let dust = document.createElement("div");

    dust.className = "dust";

    dust.style.left = Math.random()*100 + "%";
    dust.style.animationDelay = Math.random()*10 + "s";
    dust.style.animationDuration = (5 + Math.random()*10) + "s";

    dustContainer.appendChild(dust);
}
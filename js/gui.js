let menu = document.getElementById("menu");
let menuLevel = document.getElementById("menuLevel");
let menuControl = document.getElementById("menuControl");
let menuPause = document.getElementById("menuPause");

let contOfAlert = document.getElementsByClassName("cont")[0];
let alert = document.getElementById("alert");
let menuOptions = {
    start: document.getElementById("start"),
    controls: document.getElementById("controls"),
    exit: document.getElementById("exit"),
}
let menuLevels = {
    hard: document.getElementById("hard"),
    impossible: document.getElementById("impossible"),
    dream: document.getElementById("dream"),
}
let menuControls = {
    mouse: document.getElementById("mouse"),
    keyboard: document.getElementById("keyboard"),
}
let menuPauses = {
    mouse: document.getElementById("mouse"),
    keyboard: document.getElementById("keyboard"),
}


function startGame() {
    setTimeout(() => {
        alert.innerText = ("stady");
        setTimeout(() => {
            alert.innerText = ("go");
            setTimeout(() => {
                contOfAlert.style.display = "none";
                gameStarted = 1;
                let init = requestAnimationFrame(start);
            }, 1000);
        }, 1000);
    }, 1000);
}



document.addEventListener("keyup",function (e){
	if (e.key  === "Escape" && gameOver == 0 && player.health > 0 ){
		pause();
	}else if (e.key  === "Escape" && gameOver == 1 && player.health > 0 ){
		unpause(); 
	}
});


for (const option in menuOptions) {
    if (menuOptions[option]) {
        menuOptions[option].addEventListener("click", function (e) {
            switch (e.target.id) {
                case "start":
                    menu.style.display = "none";
                    menuLevel.style.display = "block";
                    for (const level in menuLevels) {
                        menuLevels[level].addEventListener("click", function (e) {
                            switch (e.target.id) {
                                case "hard":
                                    menu.style.display = "none";
                                    menuLevel.style.display = "none";
                                    contOfAlert.style.display = "grid";
                                    Level.one();
                                    startGame();
                                    break;
                                case "impossible":
                                    menu.style.display = "none";
                                    menuLevel.style.display = "none";
                                    contOfAlert.style.display = "grid";
                                    Level.two();
                                    startGame();
                                    break;
                                case "dream":
                                    menu.style.display = "none";
                                    menuLevel.style.display = "none";
                                    contOfAlert.style.display = "grid";
                                    renderBlocks();
                                    startGame();
                                    break;
                            }
                        })
                    }
                    break;
                case "controls":
                    menu.style.display = "none";
                    menuControl.style.display = "block";
                    for (const control in menuControls) {
                        menuControls[control].addEventListener("click", function (e) {
                            switch (e.target.id) {
                                case "mouse":
                                    movementControl = 1;
                                    menu.style.display = "block";
                                    menuControl.style.display = "none";
                                    break;
                                case "keyboard":
                                    movementControl = 2;
                                    menu.style.display = "block";
                                    menuControl.style.display = "none";
                                    break;
                            }
                        })
                    }
                    break;
                case "exit":
                    window.close();
                    break;
            }
        })
    }
}
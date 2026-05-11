const menu = document.querySelector("#menu");
const description = document.querySelector("#description");
const game = document.querySelector("#game");
const leaders = document.querySelector("#leaderboard");

// Egy részét mutatja a játéknak: amit megadunk a függvény paramétereként.
function show(elem) {
    menu.classList.add('hidden');
    description.classList.add('hidden');
    game.classList.add('hidden');
    leaders.classList.add('hidden');
    elem.classList.remove('hidden');
}
show(menu);
const buttons = document.querySelectorAll(".nav-button");
buttons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = button.getAttribute("data-target");
        const targetElement = document.querySelector(`#${targetId}`);
        show(targetElement);
    });
});

// A timer a játékba.
let startTime;
let timerInterval, winTime;
document.querySelector(".start-button").addEventListener("click", () => {
    startTime = Date.now(); // Kezdeti idő.
    clearInterval(timerInterval); // Megállítjuk az esetleges előző időzítőt.
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Eltelt idő másodpercben.
        winTime = elapsedTime;
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.querySelector("#time-display").textContent = `${minutes}:${seconds}`;
    }, 1000); // Másodpercenként frissít.
});

// Név elmentése és ellenőrzés indítás előtt.
document.querySelector(".start-button").addEventListener("click", () => {
    const name = document.querySelector("#name").value;
    const username = document.querySelector("#username");
    username.textContent = name == "" ? "Anonymus" : name;
})

// Pálya nehézségének elmentése.
let difficulty = null; let track; let images = []; let originalImages = [];
document.querySelector("#easy").addEventListener("click", (event) => {
    event.preventDefault();
    difficulty = "easy";
    document.querySelector("#easy").classList.add("selected");
    document.querySelector("#hard").classList.remove("selected");
    images = initialise(difficulty);
    document.querySelector(".start-button").disabled = false;
    document.querySelector("#difficulty").classList.remove("warning");
    attachImageEvents(images);
})
document.querySelector("#hard").addEventListener("click", (event) => {
    event.preventDefault();
    difficulty = "hard";
    document.querySelector("#hard").classList.add("selected");
    document.querySelector("#easy").classList.remove("selected");
    images = initialise(difficulty);
    document.querySelector(".start-button").disabled = false;
    document.querySelector("#difficulty").classList.remove("warning");
    attachImageEvents(images);
})
document.querySelector(".start-button").addEventListener("mouseenter", (event) => {
    if (document.querySelector(".start-button").disabled == true) {
        document.querySelector("#difficulty").classList.add("warning");
    }
});
document.querySelector(".start-button").addEventListener("mouseleave", (event) => {
    document.querySelector("#difficulty").classList.remove("warning");
});

// Pálya megalkotása.
function initialise(d) {
    let images = []; originalImages = [];
    const tableElement = document.querySelector("#track table");
    tableElement.innerHTML = "";
    let x; let min = 1; let max = 5; let layoutNum;
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (d == "easy") {
        x = 5;
        tableElement.classList.add("little-table");
        tableElement.classList.remove("big-table");
        // Konkrét pálya kiválasztása (könnyű).
        for (let i = 0; i < 6; i++) {
            if (i + 1 == randomNum) {
                layoutNum = easy_maps[i];
            }
        }
    } else if (d == "hard") {
        x = 7;
        tableElement.classList.add("big-table");
        tableElement.classList.remove("little-table");
        // Konkrét pálya kiválasztása (nehéz).
        for (let i = 0; i < 6; i++) {
            if (i + 1 == randomNum) {
                layoutNum = hard_maps[i];
            }
        }
    }
    for (let i = 0; i < x; i++){
        const trElement = document.createElement("tr");
        tableElement.appendChild(trElement);
        for (let j = 0; j < x; j++){
            const tdElement = document.createElement("td");
            trElement.appendChild(tdElement);
            let img = document.createElement("img");
            switch (layoutNum.layout[i][j]) {
                case 1:
                    img.src = 'images/cells/empty.png';
                    break;
                case 21:
                    img.src = 'images/cells/bridge1.png';
                    break;
                case 22:
                    img.src = 'images/cells/bridge2.png';
                    break;
                case 31:
                    img.src = 'images/cells/mountain1.png';
                    break;
                case 32:
                    img.src = 'images/cells/mountain2.png';
                    break;
                case 33:
                    img.src = 'images/cells/mountain3.png';
                    break;
                case 34:
                    img.src = 'images/cells/mountain4.png';
                    break;
                case 4:
                    img.src = 'images/cells/oasis.png';
                    break;
            }
            tdElement.appendChild(img);
            images.push(img);
            originalImages.push(img.src);
        }
    }
    return images;
}

// Sínes cellák váltogatása.
let gameWon = false;
function attachImageEvents(imgs) {
    let imgSrc;    
    imgs.forEach((img) => {
        img.addEventListener("click", () => {
                imgSrc = "images/cells/" + img.src.split('/').pop();
                const rail = imageGroups[imgSrc];
                if (rail) {
                    img.src = rail;
                }
                // Nyerés.
                if (areConnected(imgs)) {
                    gameWon = true;
                    document.querySelector("#player").textContent = "NYERTÉL,";
                    document.querySelector("#player").classList.add("winnerTag");
                    document.querySelector("#time-tag").textContent = "ENNYI IDŐ ALATT:";
                    document.querySelector("#time-tag").classList.add("winnerTag");
                    document.querySelector("#track table").classList.add("winner");
                    addToLeaderboard(username.textContent, winTime, difficulty);
                    console.log(username.textContent)
                    console.log(winTime)
                    clearInterval(timerInterval);
                    document.querySelector("#winnerQuit").classList.remove("hidden");
                    document.querySelector("#toplist").classList.remove("hidden");
                    imgs.forEach((img) => {
                        img.addEventListener("mouseenter", (event) => {
                            img.classList.add("disable-click");
                        });
                    });
                }
        });
    });
}
document.querySelector("#winnerQuit").addEventListener("click", () => {
    document.querySelector("#player").textContent = "JÁTÉKOS:";
    document.querySelector("#player").classList.remove("winnerTag");
    document.querySelector("#time-tag").textContent = "ELTELT IDŐ:";
    document.querySelector("#time-tag").classList.remove("winnerTag");
    document.querySelector("#track table").classList.remove("winner");
    document.querySelector("#winnerQuit").classList.add("hidden");
    document.querySelector("#toplist").classList.add("hidden");
    gameWon = false;
});

// SPACE lenyomásával töröl mindent, az eredeti állapotból kezdhetjük.
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        images.forEach((img, index) => {
            img.src = originalImages[index]; 
        });
    }
});

// RAILWAYS kép lenyomásával visszalépünk a menübe.
document.querySelector(".title2").addEventListener("mouseenter", (event) => {
    if (gameWon == false)
    document.querySelector("#quit").textContent = "KATTINTÁSRA KILÉPSZ, DE NE ADD FEL, MEGY AZ! :)";
});
document.querySelector(".title2").addEventListener("mouseleave", (event) => {
    document.querySelector("#quit").textContent = "";
});
document.querySelector(".title2").addEventListener("click", (event) => {
    clearInterval(timerInterval);
    document.querySelector("#time-display").textContent = "INDUL...";
    document.querySelector("#username").textContent = "";
    difficulty = null;
    document.querySelector("#easy").classList.remove("selected");
    document.querySelector("#hard").classList.remove("selected");
    const tableElement = document.querySelector("#track table");
    tableElement.innerHTML = "";
    document.querySelector("#name").value = "";
    document.querySelector(".start-button").disabled = true;
    originalImages = [];
    show(menu); 
});

// ENTER a Start gomb lenyomása legyen a menünél.
const startButton = document.querySelector(".start-button");
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !startButton.disabled) {
        startButton.click();
    }
});

// Kapcsolódások ellenőrzése.
function areConnected(imgs) {
    let up, down, right, left, one, two, counter = 0;
    let imgSrc, upSrc, downSrc, rightSrc, leftSrc;
    let test = 0;
    let x = difficulty == "easy" ? 5 : 7;

    for (let i = 0; i < imgs.length; i++) {
        up = i - x;
        down = i + x;
        right = i + 1;
        left = i - 1;
        imgSrc = "images/cells/" + imgs[i].src.split('/').pop();
        if (connectionRules[imgSrc]) {
            one = connectionRules[imgSrc][0];
            two = connectionRules[imgSrc][1];
        } 
        upSrc = up >= 0 ? "images/cells/" + imgs[up].src.split('/').pop() : null;
        downSrc = down < imgs.length ? "images/cells/" + imgs[down].src.split('/').pop() : null;
        rightSrc = right % x !== 0 ? "images/cells/" + imgs[right].src.split('/').pop() : null;
        leftSrc = i % x !== 0 ? "images/cells/" + imgs[left].src.split('/').pop() : null;
        if (one == "up" && two == "down") {
            if ((upSrc && checkUp(upSrc, imgSrc)) && (downSrc && checkDown(downSrc, imgSrc))) test++;
        } else if (one == "up" && two == "right") {
            if ((upSrc && checkUp(upSrc, imgSrc)) && (rightSrc && checkRight(rightSrc, imgSrc))) test++;
        } else if (one == "up" && two == "left") {
            if ((upSrc && checkUp(upSrc, imgSrc)) && (leftSrc && checkLeft(leftSrc, imgSrc))) test++;
        } else if (one == "down" && two == "right") {
            if ((downSrc && checkDown(downSrc, imgSrc)) && (rightSrc && checkRight(rightSrc, imgSrc))) test++;
        } else if (one == "down" && two == "left") {
            if ((downSrc && checkDown(downSrc, imgSrc)) && (leftSrc && checkLeft(leftSrc, imgSrc))) test++;
        } else if (one == "right" && two == "left") {
            if ((rightSrc && checkRight(rightSrc, imgSrc)) && (leftSrc && checkLeft(leftSrc, imgSrc))) test++;
        }
        if (imgSrc == 'images/cells/oasis.png') counter++;
    }
    return (x == 5 ? test == (25 - counter) : test == (49 - counter));
}
function checkUp(upSrc, imgSrc) {
    return connectionRules[upSrc] && connectionRules[upSrc].includes("down") && connectionRules[imgSrc]?.includes("up");
}

function checkDown(downSrc, imgSrc) {
    return connectionRules[downSrc] && connectionRules[downSrc].includes("up") && connectionRules[imgSrc]?.includes("down");
}

function checkRight(rightSrc, imgSrc) {
    return connectionRules[rightSrc] && connectionRules[rightSrc].includes("left") && connectionRules[imgSrc]?.includes("right");
}

function checkLeft(leftSrc, imgSrc) {
    return connectionRules[leftSrc] && connectionRules[leftSrc].includes("right") && connectionRules[imgSrc]?.includes("left");
}

// Kilépés a játékból.
document.querySelector("#winnerQuit").addEventListener("click", () => {
    clearInterval(timerInterval);
    document.querySelector("#time-display").textContent = "INDUL...";
    document.querySelector("#username").textContent = "";
    difficulty = null;
    document.querySelector("#easy").classList.remove("selected");
    document.querySelector("#hard").classList.remove("selected");
    const tableElement = document.querySelector("#track table");
    tableElement.innerHTML = "";
    document.querySelector("#name").value = "";
    document.querySelector(".start-button").disabled = true;
    originalImages = [];
    show(menu); 
});

// Toplista.
const leaderboard = {
    easy: [],
    hard: []
};
// Játékos idejének hozzáadása a toplistához
function addToLeaderboard(username, timeId, difficulty) {
    const newEntry = {
        name: username,
        time: timeId
    };
    leaderboard[difficulty].push(newEntry);
    leaderboard[difficulty].sort((a, b) => a.time - b.time);
    displayLeaderboard(difficulty);
}

// A toplista megjelenítése
function displayLeaderboard(difficulty) {
    const leaderboardElement = document.querySelector(`#leaderboard-${difficulty}`);
    leaderboardElement.innerHTML = ""; 
    leaderboard[difficulty].forEach((entry, index) => {
        const listItem = document.createElement("li");
        const minutes = Math.floor(entry.time / 60);
        const seconds = entry.time % 60;
        listItem.textContent = `${index + 1}. ${entry.name} - ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        leaderboardElement.appendChild(listItem);
    });
}

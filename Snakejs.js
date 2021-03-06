const snakeCanvas = document.getElementById("snakeCanvas");
const ctx = snakeCanvas.getContext("2d");
const p = document.getElementById("playerScore");
const snakeCanvasColor = "white";
const snakeCanvasBorderColor = "#6c625a";
const snakeColor = "#29A829";
const foodColor = "#6c625a";
let randomNum1 = 0;
let randomNum2 = 0;
let playerSpeed = 150;
let dx = 10;
let dy = 0;
let snakeFood = { x: randomNum1, y: randomNum2 }; // always put after createFood()
let snake = [
    { x: 150, y: 150 }, // head of the snake
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
];
function random10(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
function createFood() {
    randomNum1 = random10(0, snakeCanvas.width - 10);
    randomNum2 = random10(0, snakeCanvas.width - 10);
    snakeFood = { x: randomNum1, y: randomNum2 }; // always put after createFood()
    ifFoodOnSnake();
}
function ifFoodOnSnake() {
    snake.forEach(snakePart => {
        if (snakePart.x == snakeFood.x &&
            snakePart.y == snakeFood.y) {
            createFood();
        }
    });
}
function clearCanvas() {
    ctx.fillStyle = snakeCanvasColor;
    ctx.strokeStyle = snakeCanvasBorderColor;
    ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    ctx.strokeRect(0, 0, snakeCanvas.width, snakeCanvas.height);
}
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(snakeFood.x, snakeFood.y, 10, 10);
}
function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
}
function drawSnake() {
    snake.forEach(snakePart => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    });
}
let timeOut;
function main() {
    timeOut = setTimeout(function () {
        changingDirection = false;
        clearCanvas();
        drawSnake();
        drawFood();
        ifSnakeAteFood();
        advanceSnake();
        checkGameOver();
        if (gameOver == true) { return };
        main();
    }, playerSpeed)
}
clearCanvas();
drawSnake();
createFood();
drawFood();

document.body.addEventListener("keydown", changeDirection);
function changeDirection(e) {
    const LeftKey = 37;
    const RightKey = 39;
    const UpKey = 38;
    const DownKey = 40;
    const keyPressed = event.keyCode;
    const goingLeft = dx === -10;
    const goingRight = dx === 10;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    if ([LeftKey, RightKey, UpKey, DownKey].includes(keyPressed)) {
        e.preventDefault(); // without it, the website would scroll up and down on the arrow keys
    }

    if (changingDirection) return;
    changingDirection = true;

    if (keyPressed == LeftKey && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed == RightKey && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed == UpKey && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed == DownKey && !goingUp) {
        dx = 0;
        dy = 10;
    }
}
let gameOver = false;
function checkGameOver() {
    snake.forEach(snakePart => {
        if (snakePart.x == snakeCanvas.width ||
            snakePart.x < 0 ||
            snakePart.y == snakeCanvas.width ||
            snakePart.y < 0) {
            $("#snakeOutput").html("Game Over !");
            $("#modalSnake").modal("show");
            gameOver = true;
            setLocalStorage();
            copyIntoArray();
            printHighscore();
        }
    }
    );
    checkIfTouchesItself()
}
function checkIfTouchesItself() {
    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x &&
            snake[0].y == snake[i].y) {
            $("#snakeOutput").html("Game Over !");
            $("#modalSnake").modal("show");
            gameOver = true;
            setLocalStorage();
            copyIntoArray();
            printHighscore();
        }
    }
}
let Score = 0;
function ifSnakeAteFood() {
    if (snake[0].x == snakeFood.x && snake[0].y == snakeFood.y) {
        createFood();
        appendSnake();
        Score = Score + 10;
        p.textContent = Score;
    }
}
function appendSnake() {
    let snakeAdd = snake.slice(-1); // returns an object within an array
    let snakeAddObject = snakeAdd[0]; // removes the array around the object
    snake.push(snakeAddObject);
}
const playAgain = document.getElementById("playAgain");
playAgain.addEventListener("click", newGame)
function newGame() {
    snake = [
        { x: 150, y: 150 }, // head of the snake
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 },
    ];
    dx = 10;
    dy = 0;
    gameOver = false;
    Score = 0;
    p.textContent = Score;
    clearTimeout(timeOut);
    createFood();
    main();
    copyIntoArray();
    printHighscore();
}
function setLocalStorage() {
    let name = document.getElementById("playerName").value;
    if (name == "") {
        name = "anonymous"
    }
    if (localStorage.getItem(name) === null ||
        localStorage.getItem(name) < Score) {
        localStorage.setItem(name, Score);
    }
}
function printHighscore() {
    const body = document.getElementById("highscoreBody");
    let newHighscore = "";
    for (let i = 0; i < sortable.length; i++) {
        let key = sortable[i][0];
        let value = sortable[i][1];
        newHighscore += `<tr>
            <th>${i + 1}</th>
            <td >${key}</td>
            <td>${value}</td>
            </tr>`
    }
    body.innerHTML = newHighscore;
    console.log(sortable)
}
let sortable = [];
function copyIntoArray() {
    sortable = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        sortable.push([key, value]);
        sortArray();
    }
}
function sortArray() {
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
}
copyIntoArray();
printHighscore();
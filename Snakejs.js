const snakeCanvas = document.getElementById("snakeCanvas");
const ctx = snakeCanvas.getContext("2d");
const p = document.getElementById("playerScore");
const snakeCanvasColor = "white";
const snakeCanvasBorderColor = "#6c625a";
const snakeColor = "#29A829";
const foodColor = "#6c625a";
let randomNum = 0;
let Score = 0;
let playerSpeed = 150;
let snake = [
    { x: 150, y: 150 }, // head of the snake
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
];
let snakeFood = { x: randomNum, y: randomNum }; // always put after createFood()
function createFood() {
    randomNum = random10(0, snakeCanvas.width - 10);
    snakeFood = { x: randomNum, y: randomNum }; // always put after createFood()
    ifFoodOnSnake();
}
function ifFoodOnSnake() {
    snake.forEach(snakePart => {
        if (snakePart.x == snakeFood.x) {
            createFood();
            snakeFood = { x: randomNum, y: randomNum }; // always put after createFood()
        }
    });
}
function random10(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
createFood();
function clearCanvas() {
    ctx.fillStyle = snakeCanvasColor;
    ctx.strokeStyle = snakeCanvasBorderColor;
    ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    ctx.strokeRect(0, 0, snakeCanvas.width, snakeCanvas.height);
}
let dx = 10;
let dy = 0;
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
    snake.forEach(drawSnakePart);
}
function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
}
function main() {
    setTimeout(function () {
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
main();
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

    if (keyPressed == LeftKey && !goingRight) {
        e.preventDefault(); // without it, the website would scroll up and down on the arrow keys
        dx = -10;
        dy = 0;
    }
    if (keyPressed == RightKey && !goingLeft) {
        e.preventDefault(); // without it, the website would scroll up and down on the arrow keys
        dx = 10;
        dy = 0;
    }
    if (keyPressed == UpKey && !goingDown) {
        e.preventDefault(); // without it, the website would scroll up and down on the arrow keys
        dx = 0;
        dy = -10;
    }
    if (keyPressed == DownKey && !goingUp) {
        e.preventDefault(); // without it, the website would scroll up and down on the arrow keys
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
        }
    }
    );
    checkIfTouchesItself()
}
function checkIfTouchesItself() {
    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x &&
            snake[0].y == snake[i].y) {
            alert("GameOver!");
            gameOver = true;
        }
    }
}
function ifSnakeAteFood() {
    if (snake[0].x === snakeFood.x && snake[0].y === snakeFood.y) {
        createFood();
        snakeFood = { x: randomNum, y: randomNum }; // always put after createFood()
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
    createFood();
    main();
}
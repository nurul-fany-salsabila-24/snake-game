const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');

const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
let food = { x: 5, y: 5 };
let direction = 'right';
let score = 0;
let gameRunning = false;
let audioEnabled = false;
let flashTimer = 0;

// 🎵 Suara
const backgroundMusic = document.getElementById('backgroundMusic');
const eatSound = document.getElementById('eatSound');
const moveSound = document.getElementById('moveSound');
const gameOverSound = document.getElementById('gameOverSound');

// 🌄 Gambar background di canvas
const backgroundImage = new Image();
backgroundImage.src = "https://i.imgur.com/kG3w7zM.jpeg";
let bgReady = false;
backgroundImage.onload = () => (bgReady = true);

// Tombol mulai
startBtn.addEventListener('click', () => {
  if (!audioEnabled) {
    audioEnabled = true;
    backgroundMusic.volume = 0.2;
    backgroundMusic.play().catch(() => {});
  }
  gameRunning = true;
  startBtn.style.display = 'none';
  resetGame();
});

function draw() {
  if (bgReady) ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (flashTimer > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    flashTimer--;
  }

  ctx.fillStyle = "limegreen";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
  if (!gameRunning) return;

  const head = { ...snake[0] };

  if (direction === 'up') head.y--;
  if (direction === 'down') head.y++;
  if (direction === 'left') head.x--;
  if (direction === 'right') head.x++;

  // Tabrak tembok
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    endGame();
    return;
  }

  // Tabrak diri sendiri
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
    flashTimer = 5;
    if (audioEnabled) eatSound.play().catch(() => {});
  } else {
    snake.pop();
  }

  if (audioEnabled) {
    moveSound.currentTime = 0;
    moveSound.volume = 0.3;
    moveSound.play().catch(() => {});
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight)
  };
}

function endGame() {
  gameRunning = false;
  gameOverElement.style.display = 'block';
  startBtn.style.display = 'block';
  if (audioEnabled) gameOverSound.play().catch(() => {});
}

function resetGame() {
  snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
  direction = 'right';
  score = 0;
  scoreElement.textContent = score;
  gameOverElement.style.display = 'none';
  generateFood();
}

function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 150);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
  if (!gameRunning && e.key === 'Enter') resetGame();
});

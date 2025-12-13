const gameEl = document.getElementById('game');
const dinoEl = document.getElementById('dino');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const gameOverEl = document.getElementById('game-over');

// Set a random background image from the internet each load
const backgrounds = [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
];

const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
gameEl.style.backgroundImage = `url(${randomBg})`;
gameEl.style.backgroundSize = 'cover';
gameEl.style.backgroundPosition = 'center';
gameEl.style.backgroundRepeat = 'no-repeat';
gameEl.style.backgroundColor = '#fff';

let isJumping = false;
let velocityY = 0;
let dinoY = 0; // vertical position in px
const gravity = -0.5; // px per ms^2 (scaled)
const jumpVelocity = 10; // initial jump velocity

let lastTime = null;
let isGameOver = false;
let score = 0;
let highscore = 0;
let cactusTimer = 0;
let cactusInterval = 1500; // ms between cacti
let speedMultiplier = 1; // increases as score grows

function resetGame() {
    // Reset state
    isJumping = false;
    velocityY = 0;
    dinoY = 0;
    isGameOver = false;
    score = 0;
    cactusTimer = 0;
    cactusInterval = 1500;
    speedMultiplier = 1;
    lastTime = null;

    // Reset visuals
    dinoEl.style.bottom = '2px';
    scoreEl.textContent = 'SCORE 0';
    gameOverEl.classList.add('hidden');

    // Update highscore display
    highscoreEl.textContent = `HI ${Math.floor(highscore)}`;

    // Remove existing cacti
    document.querySelectorAll('.cactus').forEach(c => c.remove());
}

function spawnCactus() {
    const cactus = document.createElement('div');
    cactus.classList.add('cactus');

    // Randomize obstacle type
    const types = ['box', 'tall', 'wide', 'round'];
    const type = types[Math.floor(Math.random() * types.length)];
    cactus.dataset.type = type;

    // Base position
    cactus.style.bottom = '2px';
    cactus.style.right = '-60px';

    // Shape variations
    if (type === 'box') {
        cactus.style.width = '24px';
        cactus.style.height = '40px';
        cactus.style.borderRadius = '4px';
        cactus.style.background = '#424242';
    } else if (type === 'tall') {
        cactus.style.width = '18px';
        cactus.style.height = '60px';
        cactus.style.borderRadius = '4px';
        cactus.style.background = '#5d4037';
    } else if (type === 'wide') {
        cactus.style.width = '40px';
        cactus.style.height = '28px';
        cactus.style.borderRadius = '4px';
        cactus.style.background = '#1e88e5';
    } else if (type === 'round') {
        cactus.style.width = '26px';
        cactus.style.height = '26px';
        cactus.style.borderRadius = '50%';
        cactus.style.background = '#fdd835';
    }

    cactus.style.zIndex = 2;
    gameEl.appendChild(cactus);
}

function updateCacti(delta) {
    const cacti = document.querySelectorAll('.cactus');
    const speed = 0.3 * delta * speedMultiplier; // px per ms, scaled by difficulty

    cacti.forEach(cactus => {
        const currentRight = parseFloat(cactus.style.right);
        const newRight = currentRight + speed;
        cactus.style.right = newRight + 'px';

        // Remove if off-screen
        const rect = cactus.getBoundingClientRect();
        const gameRect = gameEl.getBoundingClientRect();
        if (rect.right < gameRect.left) {
            cactus.remove();
        }

        // Collision detection with dino
        const dinoRect = dinoEl.getBoundingClientRect();
        if (
            dinoRect.left < rect.right &&
            dinoRect.right > rect.left &&
            dinoRect.bottom > rect.top &&
            dinoRect.top < rect.bottom
        ) {
            isGameOver = true;
        }
    });
}

function updateDino(delta) {
    // Apply gravity
    velocityY += gravity * (delta / 16); // scale to ~60fps
    dinoY += velocityY;

    if (dinoY <= 0) {
        dinoY = 0;
        velocityY = 0;
        isJumping = false;
    }

    dinoEl.style.bottom = 2 + dinoY + 'px';
}

function gameLoop(timestamp) {
    if (lastTime === null) {
        lastTime = timestamp;
        requestAnimationFrame(gameLoop);
        return;
    }

    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if (!isGameOver) {
        // Update dino
        updateDino(delta);

        // Update cacti and spawn new ones
        cactusTimer += delta * speedMultiplier;
        if (cactusTimer > cactusInterval) {
            spawnCactus();
            cactusTimer = 0;
        }
        updateCacti(delta);

        // Update score
        score += delta * 0.01;
        scoreEl.textContent = `SCORE ${Math.floor(score)}`;

        // Increase difficulty every 50 points
        const difficultyLevel = Math.floor(score / 50);
        speedMultiplier = 1 + difficultyLevel * 0.15; // 15% faster per 50 points
        cactusInterval = Math.max(600, 1500 - difficultyLevel * 80); // spawn a bit faster over time

        if (score > highscore) {
            highscore = score;
            highscoreEl.textContent = `HI ${Math.floor(highscore)}`;
        }
    } else {
        gameOverEl.classList.remove('hidden');
    }

    requestAnimationFrame(gameLoop);
}

function handleJump() {
    if (isGameOver) return;
    if (!isJumping) {
        isJumping = true;
        velocityY = jumpVelocity;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
    }
    if (e.code === 'KeyR') {
        resetGame();
    }
});

// Initialize and start
resetGame();
requestAnimationFrame(gameLoop);

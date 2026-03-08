const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('flappy-score');
const overlay = document.getElementById('flappy-overlay');
const statusText = document.getElementById('flappy-status');

// --- RÉGLAGES PHYSIQUE (Plus nerveux) ---
let bird = { 
    x: 50, 
    y: 150, 
    w: 30, 
    h: 30, 
    gravity: 0.35,     // Gravité augmentée
    velocity: 0, 
    jump: -5.5         // Saut plus sec/rapide
};

let pipes = [];
let score = 0;
let gameRunning = false;
let pipeInterval = 90; 
let frameCount = 0;
let animationId; // Pour stopper proprement la boucle

function initFlappy() {
    // RESET TOTAL DU JEU
    cancelAnimationFrame(animationId); // Stop toute boucle en cours
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    scoreEl.innerText = score;
    
    statusText.innerText = "Prête ?";
    overlay.classList.remove('hidden');
    gameRunning = false;
    
    draw(); // Dessine l'état initial
}

function startFlappy() {
    // On s'assure que tout est à zéro avant de lancer
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    scoreEl.innerText = score;
    
    overlay.classList.add('hidden');
    gameRunning = true;
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Collision sol ou plafond
    if (bird.y + bird.h > canvas.height || bird.y < 0) {
        gameOver();
    }

    // Apparition des obstacles
    if (frameCount % pipeInterval === 0) {
        let gap = 130; // Un peu plus d'espace pour le confort
        let minHeight = 50;
        let height = Math.floor(Math.random() * (canvas.height - gap - 2 * minHeight)) + minHeight;
        pipes.push({ x: canvas.width, y: 0, w: 50, h: height, type: 'top', passed: false });
        pipes.push({ x: canvas.width, y: height + gap, w: 50, h: canvas.height - height - gap, type: 'bottom' });
    }

    pipes.forEach((pipe) => {
        pipe.x -= 2.5; // Vitesse de défilement légèrement augmentée

        // Collision
        if (bird.x < pipe.x + pipe.w &&
            bird.x + bird.w > pipe.x &&
            bird.y < pipe.y + pipe.h &&
            bird.y + bird.h > pipe.y) {
            gameOver();
        }

        // Score (seulement quand on passe le tuyau du haut)
        if (pipe.type === 'top' && !pipe.passed && bird.x > pipe.x + pipe.w) {
            score++;
            pipe.passed = true;
            scoreEl.innerText = score;
        }
    });

    pipes = pipes.filter(p => p.x + p.w > 0);
    frameCount++;
}

function draw() {
    // Fond ciel
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tuyaux
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.w, pipe.h);
        ctx.strokeStyle = "white";
        ctx.strokeRect(pipe.x, pipe.y, pipe.w, pipe.h);
    });

    // Cœur
    ctx.font = "30px Arial";
    ctx.fillText("❤️", bird.x, bird.y + bird.h);
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    statusText.innerText = "Score final : " + score;
    overlay.classList.remove('hidden');
}

// --- CONTRÔLES ---
function jumpAction(e) {
    if (gameRunning) {
        bird.velocity = bird.jump;
        if(e) e.preventDefault();
    }
}

window.addEventListener('keydown', (e) => { if (e.code === 'Space') jumpAction(e); });
canvas.addEventListener('touchstart', jumpAction, {passive: false});
canvas.addEventListener('mousedown', jumpAction);
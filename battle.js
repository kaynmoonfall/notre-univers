let battleGrid = [];
let foundWords = 0;
let missedShots = 0;
const cols = 6;
const rows = 8;
const totalWords = 5;

function initBattle() {
    document.getElementById('battle-start-screen').classList.remove('hidden');
    document.getElementById('battle-container').classList.add('hidden');
    document.getElementById('battle-win').classList.add('hidden');
}

function startBattleNow() {
    document.getElementById('battle-start-screen').classList.add('hidden');
    document.getElementById('battle-container').classList.remove('hidden');
    
    foundWords = 0;
    missedShots = 0;
    battleGrid = Array(cols * rows).fill(null);
    document.getElementById('battle-found').innerText = "0";
    document.getElementById('battle-missed').innerText = "0";

    // Définition des mots (bateaux) avec leurs textes
    const words = [
        { text: "JE", size: 2 },
        { text: "T'AIME", size: 4 },
        { text: "VIE", size: 3 },
        { text: "BÉBÉ", size: 4 },
        { text: "LOVE", size: 4 }
    ];

    // Placement aléatoire des mots
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            let isVert = Math.random() > 0.5;
            let col = Math.floor(Math.random() * (isVert ? cols : cols - word.size + 1));
            let row = Math.floor(Math.random() * (isVert ? rows - word.size + 1 : rows));
            let pos = [];
            
            for (let i = 0; i < word.size; i++) {
                pos.push(isVert ? (row + i) * cols + col : row * cols + (col + i));
            }

            if (pos.every(p => battleGrid[p] === null)) {
                pos.forEach((p, i) => {
                    battleGrid[p] = { char: word.text[i] || "❤️", root: word.text };
                });
                placed = true;
            }
        }
    });

    renderBattleBoard();
}
function renderBattleBoard() {
    const board = document.getElementById('battle-board');
    board.innerHTML = '';
    // On enlève les classes grid par défaut de Tailwind et on laisse notre CSS gérer
    board.className = ""; 
    board.id = "battle-board";

    for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement('div');
        cell.className = "battle-cell"; // Utilise notre classe CSS
        
        // On n'applique plus la photo en fond ici pour toutes les cases

        // Voile sombre pour cacher
        const overlay = document.createElement('div');
        overlay.className = "battle-overlay";
        overlay.id = `overlay-${i}`;
        
        cell.onclick = () => hit(i);
        cell.appendChild(overlay);
        board.appendChild(cell);
    }
}
function hit(index) {
    const overlay = document.getElementById(`overlay-${index}`);
    if (!overlay || overlay.style.opacity === "0") return;

    overlay.style.opacity = "0";
    const cell = overlay.parentElement;
    const content = battleGrid[index];

    if (content) {
        // SUCCÈS : Style bloc-note
        cell.classList.add('battle-hit');
        cell.innerHTML = `<div class="battle-letter">${content.char}</div>`;
    } else {
        // ÉCHEC : Image floue + Croix blanche
        const r = Math.floor(index / cols);
        const c = index % cols;
        
        // On applique l'image de fond
        cell.style.backgroundImage = "url('img/battle.jpg')";
        cell.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        cell.style.backgroundPosition = `${c * (100 / (cols - 1))}% ${r * (100 / (rows - 1))}%`;
        
        // On crée un conteneur pour le flou pour ne pas flouter la croix
        cell.style.filter = "blur(4px) grayscale(1)";
        
        // On ajoute la croix dans le parent (la cellule) mais on lui retire le flou
        const cross = document.createElement('div');
        cross.className = "battle-cross";
        cross.innerHTML = "✕"; // Croix plus fine et stylée
        
        // On l'ajoute après pour qu'elle soit au-dessus
        cell.parentElement.appendChild(cross);
        
        // Positionnement de la croix par dessus la cellule
        const rect = cell.getBoundingClientRect();
        const boardRect = document.getElementById('battle-board').getBoundingClientRect();
        cross.style.position = "absolute";
        cross.style.top = `${cell.offsetTop}px`;
        cross.style.left = `${cell.offsetLeft}px`;
        cross.style.width = `${cell.offsetWidth}px`;
        cross.style.height = `${cell.offsetHeight}px`;

        missedShots++;
        document.getElementById('battle-missed').innerText = missedShots;
    }
    checkWin();
}
function checkWin() {
    const revealedHits = document.querySelectorAll('#battle-board div:not([id^="overlay"])').length;
    // On considère gagné quand un certain nombre de cases lettres sont trouvées
    // Pour faire simple, on compte les ❤️ et lettres.
    const totalTargetCells = battleGrid.filter(c => c !== null).length;
    const currentFound = document.querySelectorAll('#battle-board .text-white').length;
    
    document.getElementById('battle-found').innerText = Math.floor((currentFound / totalTargetCells) * 5);

    if (currentFound === totalTargetCells) {
        document.getElementById('battle-win').classList.remove('hidden');
    }
}
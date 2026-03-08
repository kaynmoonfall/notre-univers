const questions = [
    { q: "Quel est mon plat préféré ?", options: ["Pizza", "Sushi", "Pâtes", "Tacos"], correct: 1 },
    { q: "Ma saison préférée ?", options: ["Été", "Printemps", "Automne", "Hiver"], correct: 0 },
    { q: "Ma destination de rêve ?", options: ["Japon", "Islande", "Bali", "Grèce"], correct: 2 },
    { q: "Ma couleur de yeux préférée ?", options: ["Marron", "Vert", "Bleu", "Gris"], correct: 0 },
    { q: "Question 5 ?", options: ["A", "B", "C", "D"], correct: 1 },
    { q: "Question 6 ?", options: ["A", "B", "C", "D"], correct: 2 },
    { q: "Question 7 ?", options: ["A", "B", "C", "D"], correct: 0 },
    { q: "Question 8 ?", options: ["A", "B", "C", "D"], correct: 1 },
    { q: "Question 9 ?", options: ["A", "B", "C", "D"], correct: 3 },
    { q: "Question 10 ?", options: ["A", "B", "C", "D"], correct: 2 },
    { q: "Question 11 ?", options: ["A", "B", "C", "D"], correct: 0 },
    { q: "Question 12 ?", options: ["A", "B", "C", "D"], correct: 1 },
    { q: "Question 13 ?", options: ["A", "B", "C", "D"], correct: 2 },
    { q: "Question 14 ?", options: ["A", "B", "C", "D"], correct: 3 },
    { q: "Question 15 ?", options: ["A", "B", "C", "D"], correct: 0 },
    { q: "Question 16 ?", options: ["A", "B", "C", "D"], correct: 1 },
    { q: "Question 17 ?", options: ["A", "B", "C", "D"], correct: 2 },
    { q: "Question 18 ?", options: ["A", "B", "C", "D"], correct: 3 },
    { q: "Question 19 ?", options: ["A", "B", "C", "D"], correct: 0 },
    { q: "Question 20 ?", options: ["A", "B", "C", "D"], correct: 1 }
];

let currentIndex = 0;
let userChoices = [];

function initQuiz() {
    currentIndex = 0;
    userChoices = [];
    document.getElementById('quiz-start-screen').classList.remove('hidden');
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('quiz-end-screen').classList.add('hidden');
    document.getElementById('quiz-review').classList.add('hidden');
}

function startQuizNow() {
    document.getElementById('quiz-start-screen').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const qData = questions[currentIndex];
    const progress = (currentIndex / questions.length) * 100;
    
    document.getElementById('quiz-bar').style.width = `${progress}%`;
    document.getElementById('quiz-progress').innerText = `Question ${currentIndex + 1}/${questions.length}`;
    document.getElementById('quiz-question').innerText = qData.q;
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    
    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `btn-kahoot btn-kahoot-${index} p-4 rounded-2xl shadow-lg font-bold`;
        btn.innerText = opt;
        btn.onclick = () => next(index);
        optionsDiv.appendChild(btn);
    });
}

function next(choice) {
    userChoices.push(choice);
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('quiz-end-screen').classList.remove('hidden');
    }
}

function showFinalReview() {
    document.getElementById('quiz-end-screen').classList.add('hidden');
    document.getElementById('quiz-review').classList.remove('hidden');
    
    let score = 0;
    const list = document.getElementById('quiz-review-list');
    list.innerHTML = '';

    questions.forEach((q, i) => {
        const isCorrect = userChoices[i] === q.correct;
        if (isCorrect) score++;

        const item = document.createElement('div');
        item.className = `p-3 rounded-xl border ${isCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`;
        item.innerHTML = `
            <p class="text-sm font-bold">${i+1}. ${q.q}</p>
            <p class="text-xs">Ta réponse : ${q.options[userChoices[i]]}</p>
            ${!isCorrect ? `<p class="text-xs font-bold">Correct : ${q.options[q.correct]}</p>` : ''}
        `;
        list.appendChild(item);
    });

    document.getElementById('quiz-final-score').innerText = `${score} / 20`;
}
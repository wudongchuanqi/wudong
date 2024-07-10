let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;
let mode;

// 历史统计数据
let history = JSON.parse(localStorage.getItem('history')) || [];

function startGame() {
    const operation = document.getElementById('operation').value;
    const range = parseInt(document.getElementById('range').value);
    const resultRange = parseInt(document.getElementById('resultRange').value);
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    const allowDecimals = document.getElementById('allowDecimals').checked;
    const allowNegative = document.getElementById('allowNegative').checked;
    mode = document.getElementById('mode').value;

    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    if (mode === 'selection') {
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(button);
        });
    } else if (mode === 'answer') {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'userAnswer';
        optionsContainer.appendChild(input);
        const button = document.createElement('button');
        button.innerText = '提交';
        button.onclick = () => checkAnswer(input.value);
        optionsContainer.appendChild(button);
    }

    document.getElementById('feedback').innerText = '';
    startTimer();
}

function startTimer() {
    let timeLeft = timePerQuestion;
    document.getElementById('time').innerText = timeLeft;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('time').innerText = timeLeft;
        } else {
            checkAnswer(null); 
        }
    }, 1000);
}

function checkAnswer(selectedOption) {
    clearInterval(timer);

    const currentQuestion = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');

    if (selectedOption == currentQuestion.answer) {
        score++;
        feedback.innerText = '正确!';
        feedback.style.color = 'green';
    } else {
        feedback.innerText = `错误! 正确答案是: ${currentQuestion.answer}`;
        feedback.style.color = 'red';
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 2000); 
    } else {
        setTimeout(endGame, 2000); 
    }
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    const scorePercentage = (score / questions.length) * 100;
    const finalScore = Math.round(scorePercentage);
    const result = document.createElement('div');
    let encouragement = '';

    if (finalScore === 100) {
        const messages = ['太棒了!', '优秀!', '满分，继续努力!'];
        encouragement = messages[Math.floor(Math.random() * messages.length)];
    }

    result.innerHTML = `<h2>游戏结束!</h2><p>您的得分是: ${score}/${questions.length}</p><p>${encouragement}</p>`;
    document.body.appendChild(result);

    // 保存结果到历史记录
    saveToHistory(finalScore);

    setTimeout(() => {
        document.body.removeChild(result);
        document.getElementById('settingsForm').style.display = 'block';
    }, 5000); 
}

function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const question = createQuestion(operation, range, resultRange, allowDecimals, allowNegative);
        questions.push(question);
    }
    return questions;
}

function createQuestion(operation, range, resultRange, allowDecimals, allowNegative) {
    let num1, num2, question, answer;

    switch (operation) {
        case 'addition':
            num1 = getRandomNumber(range, allowDecimals, allowNegative);
            num2 = getRandomNumber(range, allowDecimals, allowNegative);
            answer = num1 + num2;
            question = `${num1} + ${num2} = ?`;
            break;
        case 'subtraction':
            num1 = getRandomNumber(range, allowDecimals, allowNegative);
            num2 = getRandomNumber(range, allowDecimals, allowNegative);
            answer = num1 - num2;
            question = `${num1} - ${num2} = ?`;
            break;
        case 'multiplication':
            num1 = getRandomNumber(range, allowDecimals, allowNegative);
            num2 = getRandomNumber(range, allowDecimals, allowNegative);
            answer = num1 * num2;
            question = `${num1} * ${num2} = ?`;
            break;
        case 'division':
            num1 = getRandomNumber(range, allowDecimals, allowNegative);
            num2 = getRandomNumber(range, allowDecimals, allowNegative);
            answer = num1 / num2;
            question = `${num1} / ${num2} = ?`;
            break;
        case 'mixed':
            const operations = ['addition', 'subtraction', 'multiplication', 'division'];
            const randomOperation = operations[Math.floor(Math.random() * operations.length)];
            return createQuestion(randomOperation, range, resultRange, allowDecimals, allowNegative);
    }

    if (!allowNegative) {
        answer = Math.abs(answer);
    }

    if (!allowDecimals) {
        answer = Math.round(answer);
    }

    const options = generateOptions(answer, resultRange);
    return { question, answer, options };
}

function getRandomNumber(range, allowDecimals, allowNegative) {
    let number = Math.random() * range;
    if (allowDecimals) {
        number = parseFloat(number.toFixed(2));
    } else {
        number = Math.round(number);
    }
    if (allowNegative && Math.random() < 0.5) {
        number *= -1;
    }
    return number;
}

function generateOptions(correctAnswer, resultRange) {
    const options = [correctAnswer];
    while (options.length < 4) {
        let option = getRandomNumber(resultRange, false, false);
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    return shuffleArray(options);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 保存结果到历史记录
function saveToHistory(score) {
    const date = new Date().toLocaleString();
    history.push({ date, score });
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
}

// 渲染历史记录
function renderHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '<h3>历史记录</h3>';
    const table = document.createElement('table');
    historyContainer.appendChild(table);
    const thead = document.createElement('thead');
    table.appendChild(thead);
    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
    const dateHeader = document.createElement('th');
    dateHeader.innerText = '日期';
    headerRow.appendChild(dateHeader);
    const scoreHeader = document.createElement('th');
    scoreHeader.innerText = '得分';
    headerRow.appendChild(scoreHeader);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    history.forEach(record => {
        const row = document.createElement('tr');
        tbody.appendChild(row);
        const dateCell = document.createElement('td');
        dateCell.innerText = record.date;
        row.appendChild(dateCell);
        const scoreCell = document.createElement('td');
        scoreCell.innerText = `${record.score}%`;
        row.appendChild(scoreCell);
    });
}

// 清除历史记录
function clearHistory() {
    history = [];
    localStorage.removeItem('history');
    renderHistory();
}

// 初始化历史记录
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
});

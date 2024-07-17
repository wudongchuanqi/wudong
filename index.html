let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timePerQuestion;
let timer;
let operation;
let mode;
let allowDecimals;
let allowNegative;

function startGame() {
    const range = parseInt(document.getElementById('range').value, 10);
    const resultRange = parseInt(document.getElementById('resultRange').value, 10);
    const numQuestions = parseInt(document.getElementById('numQuestions').value, 10);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value, 10);
    allowDecimals = document.getElementById('allowDecimals').checked;
    allowNegative = document.getElementById('allowNegative').checked;
    operation = document.getElementById('operation').value;
    mode = document.getElementById('mode').value;

    questions = generateQuestions(operation, range, resultRange, numQuestions);
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('history').innerHTML = '';

    showQuestion();
}

function generateQuestions(operation, range, resultRange, numQuestions) {
    let questions = [];
    for (let i = 0; i < numQuestions; i++) {
        let question;
        switch (operation) {
            case 'addition':
                question = generateAdditionQuestion(range, resultRange);
                break;
            case 'subtraction':
                question = generateSubtractionQuestion(range, resultRange);
                break;
            case 'multiplication':
                question = generateMultiplicationQuestion(range, resultRange);
                break;
            case 'division':
                question = generateDivisionQuestion(range, resultRange);
                break;
            case 'mixed':
                question = generateMixedQuestion(range, resultRange);
                break;
        }
        questions.push(question);
    }
    return questions;
}

function generateAdditionQuestion(range, resultRange) {
    // 生成加法题目
    let a = getRandomNumber(range);
    let b = getRandomNumber(resultRange);
    let answer = a + b;
    return {
        question: `${a} + ${b} = ?`,
        answer: answer
    };
}

function generateSubtractionQuestion(range, resultRange) {
    // 生成减法题目
    let a = getRandomNumber(range);
    let b = getRandomNumber(resultRange);
    let answer = a - b;
    return {
        question: `${a} - ${b} = ?`,
        answer: answer
    };
}

function generateMultiplicationQuestion(range, resultRange) {
    // 生成乘法题目
    let a = getRandomNumber(range);
    let b = getRandomNumber(resultRange);
    let answer = a * b;
    return {
        question: `${a} * ${b} = ?`,
        answer: answer
    };
}

function generateDivisionQuestion(range, resultRange) {
    // 生成除法题目
    let a = getRandomNumber(range);
    let b = getRandomNumber(resultRange);
    let answer = (a / b).toFixed(2); // 保留两位小数
    return {
        question: `${a} / ${b} = ?`,
        answer: answer
    };
}

function generateMixedQuestion(range, resultRange) {
    // 生成混合题目
    const operations = ['addition', 'subtraction', 'multiplication', 'division'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    switch (operation) {
        case 'addition':
            return generateAdditionQuestion(range, resultRange);
        case 'subtraction':
            return generateSubtractionQuestion(range, resultRange);
        case 'multiplication':
            return generateMultiplicationQuestion(range, resultRange);
        case 'division':
            return generateDivisionQuestion(range, resultRange);
    }
}

function getRandomNumber(range) {
    let num = Math.floor(Math.random() * range) + 1;
    if (allowDecimals) {
        num += Math.random();
    }
    if (allowNegative && Math.random() < 0.5) {
        num = -num;
    }
    return num;
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        document.getElementById('question').innerText = currentQuestion.question;
        if (mode === 'selection') {
            showSelectionOptions(currentQuestion.answer);
        }
        document.getElementById('timer').style.display = 'block';
        document.getElementById('feedback').innerText = '';
        startTimer();
    } else {
        endGame();
    }
}

function showSelectionOptions(correctAnswer) {
    const options = [];
    options.push(correctAnswer);
    while (options.length < 4) {
        const option = (Math.random() * 20).toFixed(2); // 随机生成选项
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    options.sort(() => Math.random() - 0.5); // 打乱顺序
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-button');
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function startTimer() {
    let timeLeft = timePerQuestion;
    document.getElementById('time').innerText = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null);
        }
    }, 1000);
}

function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;
    if (mode === 'answer' && selectedAnswer === null) {
        // 在作答模式中，selectedAnswer 为 null 表示用户超时未作答
        selectedAnswer = prompt(currentQuestion.question);
    }
    if (selectedAnswer == correctAnswer) {
        score++;
        document.getElementById('feedback').innerText = '正确！';
    } else {
        document.getElementById('feedback').innerText = `错误，正确答案是 ${correctAnswer}`;
    }
    logHistory(currentQuestion.question, selectedAnswer, correctAnswer);
    currentQuestionIndex++;
    setTimeout(showQuestion, 1000);
}

function logHistory(question, selectedAnswer, correctAnswer) {
    const history = document.getElementById('history');
    const div = document.createElement('div');
    div.innerText = `问题: ${question} | 你的回答: ${selectedAnswer} | 正确答案: ${correctAnswer}`;
    history.appendChild(div);
}

function nextQuestion() {
    clearInterval(timer);
    checkAnswer(null); // 在作答模式中，null 表示用户点击“下一题”按钮跳过题目
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('settingsForm').style.display = 'block';
    alert(`游戏结束！你的得分是 ${score}/${questions.length}`);
}

function clearHistory() {
    document.getElementById('history').innerHTML = '';
}

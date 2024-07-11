let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;
let mode;

// 历史统计数据
let history = JSON.parse(localStorage.getItem('history')) || [];

// 开始游戏函数
function startGame() {
    // 获取用户选择的设置
    const operation = document.getElementById('operation').value;
    const range = parseInt(document.getElementById('range').value);
    const resultRange = parseInt(document.getElementById('resultRange').value);
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    const allowDecimals = document.getElementById('allowDecimals').checked;
    const allowNegative = document.getElementById('allowNegative').checked;
    mode = document.getElementById('mode').value;

    // 生成题目
    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    currentQuestionIndex = 0;
    score = 0;

    // 隐藏设置表单，显示游戏界面
    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion();
}

// 显示当前问题函数
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    // 根据互动模式显示选项或答案
    if (mode === 'selection') {
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-button');
            button.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(button);
        });
    } else if (mode === 'answer') {
        const button = document.createElement('button');
        button.innerText = '?';
        button.classList.add('option-button');
        button.onclick = () => checkAnswer(currentQuestion.answer);
        button.onmouseover = () => button.innerText = currentQuestion.answer;
        button.onmouseout = () => button.innerText = '?';
        optionsContainer.appendChild(button);
    }

    document.getElementById('feedback').innerText = '';
    startTimer();
}

// 开始计时器函数
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

// 检查答案函数
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
        setTimeout(showQuestion, 1000);
    } else {
        setTimeout(endGame, 1000);
    }
}

// 结束游戏函数
function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('settingsForm').style.display = 'block';
    alert(`游戏结束! 你的得分是 ${score} / ${questions.length}`);
    saveHistory(score, questions.length);
}

// 生成题目函数
function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    const questions = [];

    for (let i = 0; i < numQuestions; i++) {
        let question = {};
        let a, b, answer;

        if (operation === 'addition') {
            a = getRandomNumber(range, allowDecimals, allowNegative);
            b = getRandomNumber(range, allowDecimals, allowNegative);
            answer = a + b;
            question.question = `${a} + ${b} = ?`;
        } else if (operation === 'subtraction') {
            a = getRandomNumber(range, allowDecimals, allowNegative);
            b = getRandomNumber(range, allowDecimals, allowNegative);
            answer = a - b;
            question.question = `${a} - ${b} = ?`;
        } else if (operation === 'multiplication') {
            a = getRandomNumber(range, allowDecimals, allowNegative);
            b = getRandomNumber(range, allowDecimals, allowNegative);
            answer = a * b;
            question.question = `${a} * ${b} = ?`;
        } else if (operation === 'division') {
            b = getRandomNumber(range, allowDecimals, allowNegative);
            answer = getRandomNumber(resultRange, allowDecimals, allowNegative);
            a = b * answer;
            question.question = `${a} / ${b} = ?`;
        } else if (operation === 'mixed') {
            const operations = ['addition', 'subtraction', 'multiplication', 'division'];
            const randomOperation = operations[Math.floor(Math.random() * operations.length)];
            return generateQuestions(randomOperation, range, resultRange, 1, allowDecimals, allowNegative)[0];
        }

        if (operation !== 'division') {
            question.answer = allowDecimals ? parseFloat(answer.toFixed(2)) : answer;
        } else {
            question.answer = answer;
        }

        if (mode === 'selection') {
            question.options = generateOptions(question.answer, allowDecimals);
        }

        questions.push(question);
    }

    return questions;
}

// 生成选项函数
function generateOptions(correctAnswer, allowDecimals) {
    const options = [correctAnswer];

    while (options.length < 4) {
        let option = getRandomNumber(correctAnswer * 2, allowDecimals, false);

        if (!options.includes(option)) {
            options.push(option);
        }
    }

    return options.sort(() => Math.random() - 0.5);
}

// 获取随机数函数
function getRandomNumber(max, allowDecimals, allowNegative) {
    let number = Math.random() * max;

    if (!allowDecimals) {
        number = Math.floor(number);
    }

    if (allowNegative && Math.random() < 0.5) {
        number = -number;
    }

    return number;
}

// 保存历史记录函数
function saveHistory(score, total) {
    const record = { date: new Date().toLocaleString(), score, total };
    history.push(record);
    localStorage.setItem('history', JSON.stringify(history));
    displayHistory();
}

// 显示历史记录函数
function displayHistory() {
    const historyTable = document.createElement('table');
    historyTable.innerHTML = `
        <tr>
            <th>日期</th>
            <th>分数</th>
            <th>总题数</th>
        </tr>
    `;

    history.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.score}</td>
            <td>${record.total}</td>
        `;
        historyTable.appendChild(row);
    });

    document.getElementById('history').innerHTML = '';
    document.getElementById('history').appendChild(historyTable);
}

// 清除历史记录函数
function clearHistory() {
    localStorage.removeItem('history');
    history = [];
    displayHistory();
}

// 初始加载显示历史记录
displayHistory();

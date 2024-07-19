// 定义鼓励语数组
const messages = [
    '太棒了!', '优秀!', '满分，继续努力!', '你真棒!', '你太厉害了!',
    '干得漂亮!', '完美!', '太好了!', '真是个天才!', '出色的表现!',
    '继续保持!', '超级!', '你做得很好!', '棒极了!', '你真是高手!',
    '令人惊叹!', '非常棒!', '你做到了!', '你真是太聪明了!', '绝对出色!'
];

// 初始化问题数组
let questions = [];
// 当前问题的索引
let currentQuestionIndex = 0;
// 当前得分
let score = 0;
// 定时器变量
let timer;
// 每道题目的答题时间
let timePerQuestion;
// 游戏模式
let mode;

// 结束游戏函数
function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('settingsForm').style.display = 'block';

    // 随机选择一个鼓励语
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // 计算总得分并生成消息
    const finalScore = 100; // 固定得分为100分
    const message = `游戏结束! 你的得分是: ${finalScore}分，正确率为: ${(score / questions.length) * 100}%\n${randomMessage}`;

    // 显示鼓励语弹窗
    showEncouragementPopup(message);

    // 保存历史记录
    saveHistory(finalScore, questions.length);
}

// 显示鼓励语弹窗函数
function showEncouragementPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'encouragement-popup';
    popup.innerText = message;
    document.body.appendChild(popup);

    // 设置3秒后自动消失
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}

// 生成题目函数
function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    const questions = [];

    for (let i = 0; i < numQuestions; i++) {
        let question = {};
        let a, b, answer;

        if (operation === 'addition') {
            do {
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                answer = a + b;
            } while (Math.abs(answer) > resultRange);

            question.question = `${formatNumber(a, allowDecimals)} + ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'subtraction') {
            do {
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                if (!allowNegative && a < b) {
                    const temp = a;
                    a = b;
                    b = temp;
                }
                answer = a - b;
            } while (Math.abs(answer) > resultRange);

            question.question = `${formatNumber(a, allowDecimals)} - ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'multiplication') {
            do {
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                answer = a * b;
            } while (Math.abs(answer) > resultRange);

            question.question = `${formatNumber(a, allowDecimals)} × ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'division') {
            if (allowDecimals) {
                do {
                    do {
                        b = getRandomNumber(range, allowDecimals, allowNegative);
                    } while (b === 0);
                    a = b * getRandomNumber(resultRange, allowDecimals, allowNegative);
                    answer = a / b;
                } while (Math.abs(answer) > resultRange);
            } else {
                do {
                    do {
                        b = getRandomNumber(range, false, allowNegative);
                    } while (b <= 0);
                    a = b * Math.floor(Math.random() * (range / b)) + b;
                    answer = a / b;
                } while (!Number.isInteger(answer) || Math.abs(answer) > resultRange);
            }

            question.question = `${formatNumber(a, allowDecimals)} ÷ ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'mixed') {
            const operations = ['addition', 'subtraction', 'multiplication', 'division'];
            const randomOperation = operations[Math.floor(Math.random() * operations.length)];
            const mixedQuestion = generateQuestions(randomOperation, range, resultRange, 1, allowDecimals, allowNegative)[0];
            question = mixedQuestion;
            answer = mixedQuestion.answer;
        }

        question.answer = parseFloat(answer.toFixed(1));
        question.options = generateOptions(answer, range, allowDecimals, allowNegative);
        questions.push(question);
    }

    return questions;
}

function getRandomNumber(range, allowDecimals, allowNegative) {
    let number = Math.random() * range;
    if (!allowDecimals) number = Math.round(number);
    if (allowNegative && Math.random() < 0.5) number = -number;
    return number;
}

function generateOptions(correctAnswer, range, allowDecimals, allowNegative) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        let option = getRandomNumber(range * 2, allowDecimals, allowNegative);
        if (option !== correctAnswer) {
            options.add(option);
        }
    }

    return Array.from(options);
}

function formatNumber(number, allowDecimals) {
    return allowDecimals ? number.toFixed(1) : number.toString();
}

// 开始游戏函数
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

    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();

    // 启动定时器
    startTimer();
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerHTML = question.question;

    // 显示选项
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(option, question.answer);
        optionsDiv.appendChild(button);
    });

    // 显示定时器
    document.getElementById('timer').innerHTML = `剩余时间：<span id="time">${timePerQuestion}</span>秒`;
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (parseFloat(selectedAnswer) === parseFloat(correctAnswer)) {
        document.getElementById('feedback').innerText = '回答正确!';
        score++;
    } else {
        document.getElementById('feedback').innerText = '回答错误!';
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            showQuestion();
            document.getElementById('feedback').innerHTML = '';
        }, 1000);
    } else {
        endGame();
    }
}

function startTimer() {
    let timeLeft = timePerQuestion;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(); // 时间到，游戏结束
        }
    }, 1000);
}

function saveHistory(score, totalQuestions) {
    const historyDiv = document.getElementById('history');
    const record = document.createElement('div');
    record.innerText = `得分: ${score}分，总题目数: ${totalQuestions}`;
    historyDiv.appendChild(record);
}

function clearHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';
}

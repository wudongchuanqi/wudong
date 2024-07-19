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

// 从本地存储中获取历史记录，如果没有则初始化为空数组
let history = JSON.parse(localStorage.getItem('history')) || [];

// 开始游戏函数
function startGame() {
    console.log('开始游戏按钮被点击');
    // 获取用户选择的操作类型
    const operation = document.getElementById('operation').value;
    // 获取用户选择的范围，并解析为整数
    const range = parseInt(document.getElementById('range').value);
    // 获取用户选择的结果范围，并解析为整数
    const resultRange = parseInt(document.getElementById('resultRange').value);
    // 获取用户选择的题目数量，并解析为整数
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    // 获取用户选择的每题答题时间，并解析为整数
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    // 获取用户是否允许小数
    const allowDecimals = document.getElementById('allowDecimals').checked;
    // 获取用户是否允许负数
    const allowNegative = document.getElementById('allowNegative').checked;
    // 获取用户选择的游戏模式
    mode = document.getElementById('mode').value;

    // 根据用户设置生成题目
    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    console.log('生成的题目:', questions);
    // 重置当前问题索引和得分
    currentQuestionIndex = 0;
    score = 0;

    // 如果生成的题目为空，输出错误信息并返回
    if (!questions || questions.length === 0) {
        console.error("题目生成失败！");
        return;
    }

    // 隐藏设置表单，显示游戏界面
    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    // 显示第一题
    showQuestion();
}

// 显示当前问题函数
function showQuestion() {
    // 如果当前问题索引超出题目数量，输出错误信息并返回
    if (currentQuestionIndex >= questions.length) {
        console.error("当前问题索引超出范围！");
        return;
    }

    // 获取当前题目
    const currentQuestion = questions[currentQuestionIndex];
    // 如果当前题目未定义，输出错误信息并返回
    if (!currentQuestion) {
        console.error("当前问题未定义！");
        return;
    }

    // 显示当前题目的问题文本
    document.getElementById('question').innerText = currentQuestion.question;
    // 获取选项容器元素
    const optionsContainer = document.getElementById('options');
    // 清空选项容器
    optionsContainer.innerHTML = '';

    // 根据互动模式显示选项或答案
    if (mode === 'selection') {
        // 如果是选择模式，生成选项按钮
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-button');
            button.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(button);
        });
    } else if (mode === 'answer') {
        // 如果是答案模式，生成显示答案的按钮
        const button = document.createElement('button');
        button.innerText = '?';
        button.classList.add('option-button');
        button.onclick = () => checkAnswer(currentQuestion.answer);
        button.onmouseover = () => button.innerText = currentQuestion.answer;
        button.onmouseout = () => button.innerText = '?';
        optionsContainer.appendChild(button);
    }

    // 清空反馈文本
    document.getElementById('feedback').innerText = '';
    // 开始计时
    startTimer();
}

// 开始计时器函数
function startTimer() {
    // 设置初始剩余时间为每题答题时间
    let timeLeft = timePerQuestion;
    // 显示剩余时间
    document.getElementById('time').innerText = timeLeft;

    // 每秒更新一次计时器
    timer = setInterval(() => {
        if (timeLeft > 0) {
            // 如果还有时间，减少时间并更新显示
            timeLeft--;
            document.getElementById('time').innerText = timeLeft;
        } else {
            // 如果时间用完，检查答案
            checkAnswer(null); 
        }
    }, 1000);
}

// 检查答案函数
function checkAnswer(selectedOption) {
    // 清除计时器
    clearInterval(timer);

    // 获取当前题目
    const currentQuestion = questions[currentQuestionIndex];
    // 获取反馈元素
    const feedback = document.getElementById('feedback');

    // 判断答案是否正确
    if (parseFloat(selectedOption) === currentQuestion.answer) {
        // 答对了，增加得分，显示正确反馈
        score++;
        feedback.innerText = '正确!';
        feedback.style.color = 'green';
    } else {
        // 答错了，显示错误反馈和正确答案
        feedback.innerText = `错误! 正确答案是: ${currentQuestion.answer}`;
        feedback.style.color = 'red';
    }

    // 增加当前问题索引
    currentQuestionIndex++;

    // 如果还有未答题目，继续显示下一题，否则结束游戏
    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 1000);
    } else {
        setTimeout(endGame, 1000);
    }
}

// 定义鼓励语数组
const messages = [
    '太棒了!', '优秀!', '满分，继续努力!', '你真棒!', '你太厉害了!',
    '干得漂亮!', '完美!', '太好了!', '真是个天才!', '出色的表现!',
    '继续保持!', '超级!', '你做得很好!', '棒极了!', '你真是高手!',
    '令人惊叹!', '非常棒!', '你做到了!', '你真是太聪明了!', '绝对出色!'
];

// 结束游戏函数
function endGame(score, totalQuestions) {
    document.getElementById('game').style.display = 'none';
    document.getElementById('settingsForm').style.display = 'block';

    // 随机选择一个鼓励语
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // 计算总得分并生成消息
    const finalScore = 100; // 固定得分为100分
    const message = `游戏结束! 你的得分是: ${finalScore}分，正确率为: ${(score / totalQuestions) * 100}%\n${randomMessage}`;

    // 显示鼓励语弹窗
    showEncouragementPopup(message);

    // 保存历史记录
    saveHistory(finalScore, totalQuestions);
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
    const timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    const allowDecimals = document.getElementById('allowDecimals').checked;
    const allowNegative = document.getElementById('allowNegative').checked;

    const questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);

    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('question').innerHTML = questions[0].question;
    document.getElementById('timer').innerHTML = `剩余时间：<span id="time">${timePerQuestion}</span>秒`;

    // 显示选项
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    questions[0].options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(option, questions[0].answer);
        optionsDiv.appendChild(button);
    });

    // 启动定时器
    let timeLeft = timePerQuestion;
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(0, numQuestions); // 时间到，游戏结束
        }
    }, 1000);
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = '回答正确!';
    } else {
        document.getElementById('feedback').innerText = '回答错误!';
    }
}

function saveHistory(score, totalQuestions) {
    const historyDiv = document.getElementById('history');
    const record = document.createElement('div');
    record.innerText = `得分: ${score}, 总题目数: ${totalQuestions}`;
    historyDiv.appendChild(record);
}

function clearHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';
}

// 显示历史记录函数
function displayHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';

    history.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.classList.add('history-record');
        recordElement.innerHTML = `<p>${record.date}</p><p>得分: ${record.score}，正确率: ${record.accuracy}%</p>`;
        historyContainer.appendChild(recordElement);
    });
}

// 页面加载时显示历史记录
window.onload = displayHistory;

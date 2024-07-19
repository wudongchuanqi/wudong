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

// 结束游戏函数
function endGame() {
    // 隐藏游戏界面
    document.getElementById('game').style.display = 'none';

    // 计算得分百分比
    const scorePercentage = (score / questions.length) * 100;
    // 将得分百分比四舍五入为整数
    const finalScore = Math.round(scorePercentage);
    // 创建一个新的 div 元素来显示游戏结果
    const result = document.createElement('div');
    // 初始化鼓励信息为空
    let encouragement = '';

    // 如果得分是 100 分，随机选择一条鼓励信息
    if (finalScore === 100) {
        const messages = ['太棒了!', '优秀!', '满分，继续努力!'];
        encouragement = messages[Math.floor(Math.random() * messages.length)];
    }

    // 设置结果 div 的 HTML 内容，包含游戏结束信息、得分、正确率和鼓励信息
    result.innerHTML = `<h2>游戏结束!</h2><p>你的得分是: ${score * (100 / questions.length)} 分，正确率为: ${scorePercentage.toFixed(1)}%</p><p>${encouragement}</p>`;
    // 将结果 div 添加到页面主体
    document.body.appendChild(result);

    // 将当前得分记录添加到历史记录数组，包含日期、得分和正确率
    history.push({ date: new Date().toLocaleString(), score: score * (100 / questions.length), accuracy: scorePercentage.toFixed(1) });
    // 将历史记录保存到本地存储
    localStorage.setItem('history', JSON.stringify(history));

    // 显示更新后的历史记录
    displayHistory();
}

// 生成题目函数
function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    // 初始化问题数组
    const questions = [];

    // 根据运算类型生成题目
    for (let i = 0; i < numQuestions; i++) {
        let question = {};
        let a, b, answer;

        if (operation === 'addition') {
            // 生成加法题目
            do {
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                answer = a + b;
            } while (Math.abs(answer) > resultRange);

            question.question = `${formatNumber(a, allowDecimals)} + ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'subtraction') {
            // 生成减法题目
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
            // 生成乘法题目
            do {
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                answer = a * b;
            } while (Math.abs(answer) > resultRange);

            question.question = `${formatNumber(a, allowDecimals)} × ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'division') {
            // 生成除法题目
            do {
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                if (b === 0) continue;
                answer = a / b;
            } while (Math.abs(answer) > resultRange);

            question.question = `${formatNumber(a, allowDecimals)} ÷ ${formatNumber(b, allowDecimals)} = ?`;
        }

        question.answer = allowDecimals ? parseFloat(answer.toFixed(2)) : Math.round(answer);
        question.options = generateOptions(question.answer, allowDecimals);
        questions.push(question);
    }

    return questions;
}

// 生成随机数函数
function getRandomNumber(range, allowDecimals, allowNegative) {
    let num = Math.random() * range;
    if (!allowDecimals) num = Math.floor(num);
    if (allowNegative && Math.random() > 0.5) num *= -1;
    return num;
}

// 格式化数字函数
function formatNumber(num, allowDecimals) {
    return allowDecimals ? num.toFixed(2) : num;
}

// 生成选项函数
function generateOptions(correctAnswer, allowDecimals) {
    const options = [correctAnswer];
    while (options.length < 4) {
        let option = allowDecimals ? parseFloat((Math.random() * 10).toFixed(2)) : Math.floor(Math.random() * 10);
        if (!options.includes(option)) options.push(option);
    }
    return options.sort(() => Math.random() - 0.5);
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

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
    // 显示设置表单
    document.getElementById('settingsForm').style.display = 'block';
    
    // 计算得分百分比
    const scorePercentage = (score / questions.length) * 100;
    // 将得分百分比四舍五入为整数
    const finalScore = Math.round(scorePercentage);
    
    // 初始化鼓励信息为空
    let encouragement = '';

    // 如果得分是 100 分，随机选择一条鼓励信息
    if (finalScore === 100) {
        const messages =  [
            '太棒了!', '优秀!', '满分，继续努力!', '真是完美无缺!', '你真是个天才!', 
            '你真了不起!', '表现得真出色!', '你让我们刮目相看!', '出色的成绩!', 
            '无可挑剔!', '简直令人惊叹!', '你是我们的骄傲!', '杰出的表现!', 
            '你已经超越了极限!', '你达到了新的高度!', '你真是名不虚传!', '你值得最好的赞美!',
            '你完成得如此完美!', '你真是无敌了!', '你的努力没有白费!'
        ];
        encouragement = messages[Math.floor(Math.random() * messages.length)];
    }

    // 弹出对话框显示游戏结束信息，包含得分、正确率和鼓励信息
    alert(`游戏结束!\n你的得分是: ${finalScore} / ${questions.length}\n正确率为: ${scorePercentage.toFixed(1)}%\n${encouragement}`);

    // 保存历史记录
    saveHistory(finalScore, questions.length);
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
                // 生成两个随机数
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                // 计算答案
                answer = a + b;
            } while (Math.abs(answer) > resultRange); // 确保答案在指定范围内

            // 设置题目文本
            question.question = `${formatNumber(a, allowDecimals)} + ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'subtraction') {
            // 生成减法题目
            do {
                // 生成两个随机数
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                // 如果不允许负数，确保 a >= b
                if (!allowNegative && a < b) {
                    const temp = a;
                    a = b;
                    b = temp;
                }
                // 计算答案
                answer = a - b;
            } while (Math.abs(answer) > resultRange); // 确保答案在指定范围内

            // 设置题目文本
            question.question = `${formatNumber(a, allowDecimals)} - ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'multiplication') {
            // 生成乘法题目
            do {
                // 生成两个随机数
                a = getRandomNumber(range, allowDecimals, allowNegative);
                b = getRandomNumber(range, allowDecimals, allowNegative);
                // 计算答案
                answer = a * b;
            } while (Math.abs(answer) > resultRange); // 确保答案在指定范围内

            // 设置题目文本
            question.question = `${formatNumber(a, allowDecimals)} × ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'division') {
            // 生成除法题目
            do {
                // 生成一个非零的随机数作为除数
                b = getRandomNumber(range, allowDecimals, allowNegative);
            } while (b === 0); // 确保除数不为零

            if (allowDecimals) {
                // 如果允许小数，生成除法题目
                do {
                    // 生成随机数 a，使得 a = b * 随机数
                    a = b * getRandomNumber(resultRange, allowDecimals, allowNegative);
                    // 计算答案
                    answer = a / b;
                } while (Math.abs(answer) > resultRange); // 确保答案在指定范围内
            } else {
                // 如果不允许小数，生成能够整除的除法题目
                do {
                    // 生成随机数 a，使得 a 是 b 的整数倍
                    a = getRandomNumber(range, allowDecimals, allowNegative) * b;
                    // 计算答案
                    answer = a / b;
                } while (!Number.isInteger(answer) || Math.abs(answer) > resultRange); // 确保答案为整数并在指定范围内
            }

            // 设置题目文本
            question.question = `${formatNumber(a, allowDecimals)} ÷ ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'mixed') {
            // 生成混合题目
            const operations = ['addition', 'subtraction', 'multiplication', 'division'];
            // 随机选择一种运算类型
            const randomOperation = operations[Math.floor(Math.random() * operations.length)];
            // 递归调用生成题目函数，生成混合运算的题目
            const mixedQuestion = generateQuestions(randomOperation, range, resultRange, 1, allowDecimals, allowNegative)[0];
            question = mixedQuestion;
            answer = mixedQuestion.answer;
        }

        // 将答案保留一位小数
        question.answer = parseFloat(answer.toFixed(1));
        // 生成选项
        question.options = generateOptions(answer, range, allowDecimals, allowNegative);
        // 将题目添加到题目数组中
        questions.push(question);
    }

    return questions;
}

// 生成随机数函数
function getRandomNumber(range, allowDecimals, allowNegative) {
    // 生成范围内的随机数
    let number = Math.random() * range;
    // 如果不允许小数，取整
    if (!allowDecimals) number = Math.round(number);
    // 如果允许负数，有50%几率取负
    if (allowNegative && Math.random() < 0.5) number = -number;
    return number;
}

// 生成选项函数
function generateOptions(correctAnswer, range, allowDecimals, allowNegative) {
    // 初始化选项集合
    const options = new Set();
    // 将正确答案添加到选项集合中
    options.add(correctAnswer);

    // 生成干扰项，直到选项集合大小为4
    while (options.size < 4) {
        let option = getRandomNumber(range * 2, allowDecimals, allowNegative);
        if (option !== correctAnswer) {
            options.add(option);
        }
    }

    return Array.from(options);
}

// 格式化数字函数
function formatNumber(number, allowDecimals) {
    // 如果允许小数，保留一位小数，否则返回整数
    return allowDecimals ? number.toFixed(1) : number.toString();
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

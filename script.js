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
// 总答题时间
let totalTime;

// 从本地存储中获取历史记录，如果没有则初始化为空数组
let history = JSON.parse(localStorage.getItem('history')) || [];

// 定义鼓励语数组
const messages = [
    '太棒了!', '优秀!', '满分，继续努力!', '你真棒!', '你太厉害了!', '干得漂亮!',
    '完美!', '太好了!', '真是个天才!', '出色的表现!', '继续保持!', '超级!', '你做得很好!',
    '棒极了!', '你真是高手!', '令人惊叹!', '非常棒!', '你做到了!', '你真是太聪明了!', '真是无可挑剔!'
];

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
    // 获取用户设置的总答题时间，并解析为整数
    totalTime = parseInt(document.getElementById('totalTime').value);
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
    // 如果当前题目未定义，输出错误信息并返回
    if (!currentQuestion) {
        console.error("当前问题未定义！");
        return;
    }

    // 获取反馈元素
    const feedback = document.getElementById('feedback');
    // 检查选中的答案是否正确
    if (selectedOption === currentQuestion.answer) {
        // 如果正确，增加得分并显示正确信息
        score++;
        feedback.innerText = '正确!';
        feedback.style.color = 'green';
    } else {
        // 如果错误，显示错误信息和正确答案
        feedback.innerText = `错误! 正确答案是 ${currentQuestion.answer}`;
        feedback.style.color = 'red';
    }

    // 显示反馈2秒后进入下一题
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            // 如果题目做完了，结束游戏
            endGame();
        }
    }, 2000);
}

// 结束游戏函数
function endGame() {
    // 隐藏游戏界面，显示设置表单
    document.getElementById('game').style.display = 'none';
    document.getElementById('settingsForm').style.display = 'block';
    // 随机选择一个鼓励语
    const encouragement = messages[Math.floor(Math.random() * messages.length)];
    // 显示鼓励语弹窗
    const popup = document.getElementById('popup');
    popup.innerText = `游戏结束!\n你的得分是: ${score * 10}分\n${encouragement}`;
    popup.classList.remove('hidden');
    // 在弹窗显示10秒后隐藏
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 10000);
    // 保存历史记录
    saveHistory(score, questions.length);
}

// 生成问题函数
function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    const questions = [];

    for (let i = 0; i < numQuestions; i++) {
        let num1, num2, answer;

        // 生成运算数值
        switch (operation) {
            case 'addition':
                num1 = getRandomInt(range);
                num2 = getRandomInt(range);
                answer = num1 + num2;
                break;
            case 'subtraction':
                num1 = getRandomInt(range);
                num2 = getRandomInt(num1); // 确保不产生负数结果
                answer = num1 - num2;
                break;
            case 'multiplication':
                num1 = getRandomInt(range);
                num2 = getRandomInt(range);
                answer = num1 * num2;
                break;
            case 'division':
                num2 = getRandomInt(range - 1) + 1; // 除数不能为0
                answer = getRandomInt(resultRange) + 1;
                num1 = num2 * answer;
                break;
            case 'mixed':
                const operations = ['addition', 'subtraction', 'multiplication', 'division'];
                const randomOperation = operations[Math.floor(Math.random() * operations.length)];
                [num1, num2, answer] = generateQuestion(randomOperation, range, resultRange, allowDecimals, allowNegative);
                break;
            default:
                console.error('无效的运算类型');
                return [];
        }

        // 如果允许小数，生成浮点数
        if (allowDecimals) {
            num1 = parseFloat((num1 + Math.random()).toFixed(2));
            num2 = parseFloat((num2 + Math.random()).toFixed(2));
            answer = parseFloat((answer + Math.random()).toFixed(2));
        }

        // 如果允许负数，随机生成正负数
        if (allowNegative) {
            if (Math.random() < 0.5) num1 = -num1;
            if (Math.random() < 0.5) num2 = -num2;
        }

        // 生成问题文本和选项
        const questionText = `${num1} ${getOperationSymbol(operation)} ${num2} = ?`;
        const options = generateOptions(answer);

        // 将生成的题目加入题目数组
        questions.push({
            question: questionText,
            answer: answer,
            options: options
        });
    }

    return questions;
}

// 生成单个问题函数
function generateQuestion(operation, range, resultRange, allowDecimals, allowNegative) {
    let num1, num2, answer;

    switch (operation) {
        case 'addition':
            num1 = getRandomInt(range);
            num2 = getRandomInt(range);
            answer = num1 + num2;
            break;
        case 'subtraction':
            num1 = getRandomInt(range);
            num2 = getRandomInt(num1); // 确保不产生负数结果
            answer = num1 - num2;
            break;
        case 'multiplication':
            num1 = getRandomInt(range);
            num2 = getRandomInt(range);
            answer = num1 * num2;
            break;
        case 'division':
            num2 = getRandomInt(range - 1) + 1; // 除数不能为0
            answer = getRandomInt(resultRange) + 1;
            num1 = num2 * answer;
            break;
        default:
            console.error('无效的运算类型');
            return [];
    }

    if (allowDecimals) {
        num1 = parseFloat((num1 + Math.random()).toFixed(2));
        num2 = parseFloat((num2 + Math.random()).toFixed(2));
        answer = parseFloat((answer + Math.random()).toFixed(2));
    }

    if (allowNegative) {
        if (Math.random() < 0.5) num1 = -num1;
        if (Math.random() < 0.5) num2 = -num2;
    }

    return [num1, num2, answer];
}

// 获取随机整数函数
function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

// 获取运算符号函数
function getOperationSymbol(operation) {
    switch (operation) {
        case 'addition':
            return '+';
        case 'subtraction':
            return '-';
        case 'multiplication':
            return '*';
        case 'division':
            return '/';
        default:
            return '';
    }
}

// 生成选项函数
function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);
    while (options.size < 4) {
        options.add(correctAnswer + Math.floor(Math.random() * 10) - 5);
    }
    return Array.from(options);
}

// 保存历史记录函数
function saveHistory(score, numQuestions) {
    history.push({ score, numQuestions, date: new Date().toLocaleString() });
    localStorage.setItem('history', JSON.stringify(history));
}

// 清除历史记录函数
function clearHistory() {
    history = [];
    localStorage.removeItem('history');
    document.getElementById('history').innerHTML = '';
}

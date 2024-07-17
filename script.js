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

    if (parseFloat(selectedOption) === currentQuestion.answer) {
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
// 生成问题的函数
// 修改生成题目的函数，保留一位小数
// 修改生成题目的函数，处理负数和小数的显示
function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    const questions = [];

    for (let i = 0; i < numQuestions; i++) {
        let question = {};
        let a, b, answer;

        if (operation === 'addition') {
            a = getRandomNumber(range, allowDecimals, allowNegative);
            b = getRandomNumber(range, allowDecimals, allowNegative);
            answer = a + b;
            question.question = `${formatNumber(a, allowDecimals)} + ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'subtraction') {
            a = getRandomNumber(range, allowDecimals, allowNegative);
            b = getRandomNumber(range, allowDecimals, allowNegative);
            // 确保减法结果为非负数
            if (!allowNegative && a < b) {
                const temp = a;
                a = b;
                b = temp;
            }
            answer = a - b;
            question.question = `${formatNumber(a, allowDecimals)} - ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'multiplication') {
            a = getRandomNumber(range, allowDecimals, allowNegative);
            b = getRandomNumber(range, allowDecimals, allowNegative);
            answer = a * b;
            question.question = `${formatNumber(a, allowDecimals)} * ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'division') {
            // 避免除数为0，重新生成直到不为0
            do {
                b = getRandomNumber(range, allowDecimals, allowNegative);
            } while (b === 0);

            answer = getRandomNumber(resultRange, allowDecimals, allowNegative);
            a = b * answer;
            question.question = `${formatNumber(a, allowDecimals)} / ${formatNumber(b, allowDecimals)} = ?`;
        } else if (operation === 'mixed') {
            const operations = ['addition', 'subtraction', 'multiplication', 'division'];
            const randomOperation = operations[Math.floor(Math.random() * operations.length)];
            return generateQuestions(randomOperation, range, resultRange, 1, allowDecimals, allowNegative)[0];
        }

        // 处理答案的格式，小数保留一位
        question.answer = allowDecimals ? parseFloat(answer.toFixed(1)) : answer;

        // 如果是选择模式，生成选项
        if (mode === 'selection') {
            question.options = generateOptions(question.answer, allowDecimals);
        }

        questions.push(question);
    }

    return questions;
}

// 格式化数字，处理负数和小数的显示
function formatNumber(number, allowDecimals) {
    if (allowDecimals) {
        return number.toFixed(1); // 保留一位小数
    } else {
        return number.toString().replace('.0', ''); // 转换为字符串，并移除.0
    }
}

// 生成选项函数
/**
 * 生成选项函数
 * @param {number} correctAnswer 正确答案
 * @param {boolean} allowDecimals 是否允许小数
 * @returns {Array<number>} 返回包含正确答案和三个随机选项的数组
 */
function generateOptions(correctAnswer, allowDecimals) {
    const options = [correctAnswer];
    const range = correctAnswer > 10 ? correctAnswer - 5 : correctAnswer;

    while (options.length < 4) {
        let option = getRandomNumber(range, allowDecimals, false);

        // 如果允许小数，随机调整选项的小数部分
        if (allowDecimals) {
            option += parseFloat((Math.random() * (Math.random() < 0.5 ? 1 : -1)).toFixed(1));
            option = parseFloat(option.toFixed(1));
        }

        // 保证生成的选项不重复且不超过正确答案
        if (!options.includes(option) && option !== correctAnswer) {
            options.push(option);
        }
    }

    return shuffleArray(options); // 随机打乱选项顺序
}

// 工具函数：随机打乱数组顺序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 生成随机数函数
function getRandomNumber(range, allowDecimals, allowNegative) {
    let number = Math.random() * range;
    if (allowDecimals) {
        number = parseFloat(number.toFixed(1)); // 保留一位小数
    } else {
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
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '<h3>历史记录</h3>';
    history.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.innerText = `${record.date} - 得分: ${record.score}/${record.total}`;
        historyContainer.appendChild(recordElement);
    });
}

// 清除历史记录函数
function clearHistory() {
    history = [];
    localStorage.removeItem('history');
    displayHistory();
}

// 页面加载完成后显示历史记录
window.onload = displayHistory;

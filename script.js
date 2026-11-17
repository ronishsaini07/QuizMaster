
// 1. Quiz Questions

const questions = [
    {
        question: "Which keyword is used to declare a variable?",
        options: ["var", "int", "string", "float"],
        answer: "var"
    },
    {
        question: "Which company developed JavaScript?",
        options: ["Google", "Netscape", "Microsoft", "Apple"],
        answer: "Netscape"
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["##", "//", "<!-- -->", "**"],
        answer: "//"
    },
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "None"
        ],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "Which method prints output in the console?",
        options: ["print()", "console.log()", "display()", "write()"],
        answer: "console.log()"
    },
    {
        question: "Which data type stores true or false?",
        options: ["String", "Number", "Boolean", "Array"],
        answer: "Boolean"
    },
    {
        question: "Which keyword declares a constant?",
        options: ["let", "var", "const", "static"],
        answer: "const"
    },
    {
        question: "Which method adds an element to an array?",
        options: ["push()", "pop()", "shift()", "remove()"],
        answer: "push()"
    },
    {
        question: "Which operator checks strict equality?",
        options: ["=", "==", "===", "!="],
        answer: "==="
    },
    {
        question: "Which event occurs when a user clicks a button?",
        options: ["hover", "click", "change", "load"],
        answer: "click"
    }
];


// 2. Variables

let currentQuestion = 0;
let answeredQuestions = [];
let timeLeft = 60;
let timerInterval;
let quizFinished = false;


// 3. HTML Elements

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const nextBtn = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");
const restartBtn = document.getElementById("restartBtn");
const themeToggle = document.getElementById("themeToggle");

const timerDisplay = document.getElementById("timer");
const feedback = document.getElementById("feedback");


// 4. Load Saved High Score

let highScore = Number(localStorage.getItem("quizHighScore")) || 0;

document.getElementById("highScore").textContent =
    "Your Best Score: " + highScore + "/10";


// 5. Start Quiz

startBtn.addEventListener("click", function () {

    currentQuestion = 0;
    answeredQuestions = [];
    timeLeft = 60;
    quizFinished = false;

    timerDisplay.textContent = timeLeft;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showQuestion();
    startTimer();

});


// 6. Display Questions

function showQuestion() {

    let current = questions[currentQuestion];

    document.getElementById("questionCounter").textContent =
        "Question " + (currentQuestion + 1) +
        " of " + questions.length;

    document.getElementById("progressBar").style.width =
        ((currentQuestion + 1) / questions.length) * 100 + "%";

    questionText.textContent = current.question;

    optionsContainer.innerHTML = "";
    feedback.textContent = "";

    current.options.forEach(function (option) {

        let button = document.createElement("button");

        button.textContent = option;
        button.classList.add("option-btn");

        button.addEventListener("click", function () {
            checkAnswer(button, option);
        });

        optionsContainer.appendChild(button);

    });

    // Restore previously selected answer

    let previousAnswer = answeredQuestions[currentQuestion];

    if (previousAnswer !== undefined) {

        let allButtons = document.querySelectorAll(".option-btn");

        allButtons.forEach(function (btn) {

            btn.disabled = true;

            if (btn.textContent === current.answer) {
                btn.style.background = "green";
            }

            if (
                btn.textContent === previousAnswer &&
                previousAnswer !== current.answer
            ) {
                btn.style.background = "red";
            }

        });

        feedback.textContent =
            previousAnswer === current.answer
                ? "Correct Answer!"
                : "Wrong Answer!";

    }

    previousBtn.disabled = currentQuestion === 0;

    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next";

}


// 7. Check Answers

function checkAnswer(button, selectedOption) {

    if (answeredQuestions[currentQuestion] !== undefined) {
        return;
    }

    let correctAnswer = questions[currentQuestion].answer;

    answeredQuestions[currentQuestion] = selectedOption;

    let allButtons = document.querySelectorAll(".option-btn");

    allButtons.forEach(function (btn) {

        btn.disabled = true;

        if (btn.textContent === correctAnswer) {
            btn.style.background = "green";
        }

    });

    if (selectedOption === correctAnswer) {

        feedback.textContent = "Correct Answer!";
        feedback.style.color = "#50d890";

    } else {

        button.style.background = "red";
        feedback.textContent = "Wrong Answer!";
        feedback.style.color = "#ff7777";

    }

}


// 8. Next Button

nextBtn.addEventListener("click", function () {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;
        showQuestion();

    } else {

        showResults();

    }

});


// 9. Previous Button

previousBtn.addEventListener("click", function () {

    if (currentQuestion > 0) {

        currentQuestion--;
        showQuestion();

    }

});


// 10. Countdown Timer

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(function () {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timerInterval);
            showResults();

        }

    }, 1000);

}


// 11. Calculate Score

function calculateScore() {

    let score = 0;

    answeredQuestions.forEach(function (answer, index) {

        if (answer === questions[index].answer) {
            score++;
        }

    });

    return score;

}


// 12. Show Final Results

function showResults() {

    if (quizFinished) {
        return;
    }

    quizFinished = true;

    clearInterval(timerInterval);

    let score = calculateScore();

    let percentage = Math.round(
        (score / questions.length) * 100
    );

    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    document.getElementById("finalScore").textContent =
        "Your Score: " + score + "/" + questions.length;

    document.getElementById("finalPercent").textContent =
        "Your Percentage: " + percentage + "%";

    // Save High Score

    if (score > highScore) {

        highScore = score;

        localStorage.setItem("quizHighScore", highScore);

    }

    document.getElementById("highScore").textContent =
        "Your Best Score: " + highScore + "/10";

    document.getElementById("resultHighScore").textContent =
        "Your Best Score: " + highScore + "/10";

    showReview();

}


// 13. Answer Review

function showReview() {

    const reviewContainer =
        document.getElementById("reviewContainer");

    reviewContainer.innerHTML = "";

    questions.forEach(function (question, index) {

        let userAnswer = answeredQuestions[index];

        let isCorrect = userAnswer === question.answer;

        let reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");

        let questionHeading = document.createElement("h3");

        questionHeading.textContent =
            (index + 1) + ". " + question.question;

        let yourAnswer = document.createElement("p");

        yourAnswer.textContent =
            "Your Answer: " + (userAnswer || "Not Answered");

        let correctAnswer = document.createElement("p");

        correctAnswer.textContent =
            "Correct Answer: " + question.answer;

        let result = document.createElement("p");

        result.textContent = isCorrect
            ? "Correct"
            : "Incorrect";

        result.classList.add(
            isCorrect ? "correct-text" : "wrong-text"
        );

        reviewItem.appendChild(questionHeading);
        reviewItem.appendChild(yourAnswer);
        reviewItem.appendChild(correctAnswer);
        reviewItem.appendChild(result);

        reviewContainer.appendChild(reviewItem);

    });

}


// 14. Restart Quiz

restartBtn.addEventListener("click", function () {

    clearInterval(timerInterval);

    currentQuestion = 0;
    answeredQuestions = [];
    timeLeft = 60;
    quizFinished = false;

    timerDisplay.textContent = timeLeft;

    resultScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    document.getElementById("highScore").textContent =
        "Your Best Score: " + highScore + "/10";

});


// 15. Dark and Light Mode

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        themeToggle.textContent = "Dark Mode";

    } else {

        themeToggle.textContent = "Light Mode";

    }

});

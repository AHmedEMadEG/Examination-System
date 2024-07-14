import { Question } from "../modules/Question.js";

const welcomeContainer = $('.welcome-container');
const examContainer = $('.exam-container');
const resultsContainer = $('.results-container');
const questionsContainer = $('.questions-container');
const flaggedContainer = $('.flagged-questions-container');

let nextBtn = null;
let flagBtn = null;
let prevBtn = null;


let questionContainer = null;
let questionsArray = [];

let currentQuestion = 0;

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

!loggedInUser && location.replace("../../pages/index.html");

loggedInUser && welcomeContainer.find('h1').text(
    `Welcome to the Examination System Eng/ ${loggedInUser.firstName} ${loggedInUser.lastName}`);


const calculateResult = () => {
    let correctAnswers = 0;
    questionsArray.forEach((question) => {
        (question.selectedAnswer === question.correctAnswer) && correctAnswers++;
        question.isCorrect = question.selectedAnswer === question.correctAnswer;
    });
    return correctAnswers;
};
    
const timedOut = () => {
    resultsContainer.css("display", "block");
    examContainer.css("display",  "none");
    $("#score").text(calculateResult());
};

const createDomQuestion = (question, index) => {
    const questionObj = new Question(question)
    const questionContainer = $('<div class="question-container"></div>');
    const body = $(`<h3 class='question-body'>${index + 1}. ${question.question_body}</h3>`);
    questionContainer.append(body);
    const ul = $(`<ul class='answers'></ul>`);
    question.answers.forEach((answer, index) => {
        const li = $(`<li><input type="radio" id="${index}_${answer}" 
        name="${question.id}" value="${answer}"><label for="${index}_${answer}">${answer}</label></li>`);
        li.on("change", (e) => {
            questionObj.selectedAnswer = e.target.value; 
        });
        ul.append(li);
    });
    questionsArray.push(questionObj);
    questionContainer.append(ul);
    questionsContainer.append(questionContainer);
};

const initializeQuestions = (questions) => {
    questions.forEach((question, index) => {
        createDomQuestion(question, index);
    });
    questionContainer = $('.question-container');
    prevBtn = $(`<button class="question__prev-btn question__btn">PREVIOUS</button>`);
    nextBtn = $(`<button class="question__next-btn question__btn">NEXT</button>`);
    flagBtn = $(`<button class="question__flag-btn question__btn">FLAG</button>`);

    questionsContainer.append(prevBtn);
    questionsContainer.append(nextBtn);
    questionsContainer.append(flagBtn);
    
    flagBtn.on("click", flagQuestion);
    nextBtn.on("click", showNextQuestion);
    prevBtn.on("click", showPreviousQuestion);

    questionContainer[0].style.display = "block";
    nextBtn.css("display","inline");
    flagBtn.css("display","inline");
};


const startExam = async () => {
  const confirmation = confirm("are you sure you wanna start the exam?");

  if (confirmation){
    welcomeContainer.css("display", "none");
    examContainer.css("display",  "flex");
    const questions = await $.getJSON('../../questions.json');
    initializeQuestions(questions);
    startTimer();
  }
};

const startTimer = () => {
    $(".timer-container").css("display", "flex");
    const examDuration = 10;
    let remainingTime = examDuration;

    const progressBar = $('.progress');
    const timerText = $('.timer-text');

    const updateTimer = () => {
        if (remainingTime === 0) {
            clearInterval(timerInterval);
            timedOut();
        }else{
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timerText.text(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

            const progressPercentage = (remainingTime / examDuration) * 100;
            progressBar.css('width', `${progressPercentage}%`);
        }
    };

    // Initialize timer
    updateTimer();

    const timerInterval = setInterval(updateTimer, 1000);
};


$("#button__start").on("click", startExam);

const showAndHideBtns = () => {
    currentQuestion ? prevBtn.css("display", "inline") : prevBtn.css("display", "none"); // if currentQuestion not 0 show else hide
    (currentQuestion === 9) ? nextBtn.css("display", "none") : nextBtn.css("display", "inline"); // if currentQuestion 9 hide else show
};

const showNextQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion + 1) % questionContainer.length; // 0 - length of questions
    questionContainer[currentQuestion].style.display = "block";
    questionsArray[currentQuestion].flagged ? flagBtn.text("UNFLAG") : flagBtn.text("FLAG");
    
    showAndHideBtns();
};


const showPreviousQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion - 1 + questionContainer.length) % questionContainer.length; // length of questions - 0
    questionsArray[currentQuestion].flagged ? flagBtn.text("UNFLAG") : flagBtn.text("FLAG");

    questionContainer[currentQuestion].style.display = "block";
    
    showAndHideBtns();
};

const flagQuestion = () => {
    questionsArray[currentQuestion].flagged = !questionsArray[currentQuestion].flagged;

    if(questionsArray[currentQuestion].flagged){
        !(flaggedContainer.children().length) && flaggedContainer.css("display", "block");
        const flaggedQuestion = $(`<div class="flagged-question">${$(questionContainer[currentQuestion])
                .find('.question-body').text()}</div>`);

        let cq = currentQuestion; // closure on currentQuestion value for each instance
        flaggedQuestion.on("click", () => {
            questionContainer[currentQuestion].style.display = "none";
            currentQuestion = cq;
            questionContainer[currentQuestion].style.display = "block";
            showAndHideBtns();
        });

        flaggedContainer.append(flaggedQuestion);
    }else{
        flaggedContainer.children().each((index, element) => {
            if($(element).text() === $(questionContainer[currentQuestion]).find('.question-body').text()){
                flaggedContainer.children().eq(index).remove();
            }
        });
        !(flaggedContainer.children().length) && flaggedContainer.css("display", "none");
    }

    questionsArray[currentQuestion].flagged ? flagBtn.text("UNFLAG") : flagBtn.text("FLAG");
};

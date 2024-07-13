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

const timedOut = () => {
    resultsContainer.css("display", "block");
    examContainer.css("display", "none");
};

const createDomQuestion = (question, index) => {
    const questionObj = new Question(question)
    questionsArray.push(questionObj);
    const questionContainer = $('<div class="question-container"></div>');
    const body = $(`<h3 class='question-body'>${index + 1}. ${question.question_body}</h3>`);
    questionContainer.append(body);
    const ul = $(`<ul class='answers'></ul>`);
    question.answers.forEach((answer, index) => {
        const li = $(`<li><input type="radio" id="${index}_${answer}" 
        name="${question.id}" value="${answer}"><label for="${index}_${answer}">${answer}</label></li>`);
        ul.append(li);
    });
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
//   const confirmation = confirm("are you sure you wanna start the exam?"); // for testing purposes

  if (1){
    welcomeContainer.css("display", "none");
    examContainer.css("display",  "flex");
    const questions = await $.getJSON('../../questions.json');
    // setTimeout(timedOut, 1000 * 60);
    initializeQuestions(questions);
  }
};

$("#button__start").on("click", startExam);
startExam();  // for testing purposes

const showNextQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion + 1) % questionContainer.length; // 0 - length of questions
    questionContainer[currentQuestion].style.display = "block";
    questionsArray[currentQuestion].flagged ? flagBtn.text("UNFLAG") : flagBtn.text("FLAG");
    
    currentQuestion ? prevBtn.css("display", "inline") : prevBtn.css("display", "none"); // if currentQuestion not 0 show else hide
    (currentQuestion === 9) ? nextBtn.css("display", "none") : nextBtn.css("display", "inline"); // if currentQuestion 9 hide else show
};


const showPreviousQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion - 1 + questionContainer.length) % questionContainer.length; // length of questions - 0
    questionsArray[currentQuestion].flagged ? flagBtn.text("UNFLAG") : flagBtn.text("FLAG");

    questionContainer[currentQuestion].style.display = "block";
    
    currentQuestion ? prevBtn.css("display", "inline") : prevBtn.css("display", "none");
    (currentQuestion === 9) ? nextBtn.css("display", "none") : nextBtn.css("display", "inline"); // if currentQuestion 9 hide else show
};

const flagQuestion = () => {
    questionsArray[currentQuestion].flagged = !questionsArray[currentQuestion].flagged;

    if(flagBtn.text() === "FLAG"){
        !(flaggedContainer.children().length) && flaggedContainer.css("display", "block");
        flaggedContainer.append(
            `<div class="flagged-question">${$(questionContainer[currentQuestion])
                .find('.question-body').text()}</div>`);
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

// import { Question } from "../modules/Questions.js";

const welcomeContainer = $('.welcome-container');
const examContainer = $('.exam-container');
const resultsContainer = $('.results-container');
const questionsContainer = $('.questions-container');

let currentQuestion = 0;

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

!loggedInUser && location.replace("../../pages/index.html");

loggedInUser && welcomeContainer.find('h1').text(
    `Welcome to the Examination System Eng/ ${loggedInUser.firstName} ${loggedInUser.lastName}`);

const timedOut = () => {
    resultsContainer.css("display", "block");
    examContainer.css("display", "none");
};

const createDomQuestion = (question) => {
    const questionContainer = $('<div class="question-container"></div>');
    const body = $(`<h3 class='question-body'>${question.question_body}</h3>`);
    questionContainer.append(body);
    const ul = $(`<ul class='answers'></ul>`);
    question.answers.forEach((answer, index) => {
        const li = $(`<li><input type="radio" id="${index}_${answer}" 
        name="${question.id}" value="${answer}"><label for="${index}_${answer}">${answer}</label></li>`);
        ul.append(li);
    });
    questionContainer.append(ul);
    questionsContainer.prepend(questionContainer);
};

const initializeQuestions = (questions) => {
    questions.forEach(question => {
        createDomQuestion(question);
    });
    questionsContainer.css("display", "block");

    const questionContainer = $('.question-container');
    questionContainer[0].style.display = "block";
};


const startExam = async () => {
    const confirmation = confirm("are you sure you wanna start the exam?");

    if (confirmation) {
        welcomeContainer.css("display", "none");
        examContainer.css("display", "block");
        const questions = await $.getJSON('../../questions.json');
        setTimeout(timedOut, 1000 * 60);
        initializeQuestions(questions);
    }
};

$("#button__signUp").on("click", startExam);

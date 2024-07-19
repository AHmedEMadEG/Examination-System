import { Question } from "../../modules/Question.js";
import { showAndHideBtns, showNextQuestion, showPreviousQuestion, flagQuestion } from "./ControlButtons.js";
import { calculateUnansweredQuestions, timedOut } from "./ExamSubmission.js";


export let questionContainer = null;
export const welcomeContainer = $('.welcome-container');
const examContainer = $('.exam-container');
const questionsContainer = $('.questions-container');

export let questionsArray = [];

export let nextBtn = null;
export let flagBtn = null;
export let prevBtn = null;
export let submitBtn = null;

let timerInterval = null;


const createDomQuestion = (question, index) => {
    const questionObj = new Question(question);
    const questionContainer = $('<div class="question-container"></div>');
    const body = $(`<h3 class='question-body'>${index + 1}. ${question.question_body}</h3>`);
    questionContainer.append(body);
    const ul = $(`<ul class='answers'></ul>`);
    question.answers.forEach((answer, i) => {
        const li = $(`<li><input type="radio" id="${index}_${i}" name="${question.id}" value="${answer}"> <label for="${index}_${i}">${answer}</label></li>`);
        li.on("click", () => {
            questionObj.selectedAnswer = answer;
            ul.find('li').removeClass('selected');
            li.addClass('selected');
        });
        ul.append(li);
    });

    questionsArray.push(questionObj);
    questionContainer.append(ul);
    questionsContainer.append(questionContainer);
};

// Fisher-Yates shuffle algorithm from chatGPT
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const initializeQuestions = (questions) => {
    questions = shuffleArray(questions);
    questions.forEach((question, index) => {
        createDomQuestion(question, index);
    });
    questionContainer = $('.question-container');
    const btnsContainer = $("<div class='exam__btns-container'></div>");
    prevBtn = $(`<button class="question__prev-btn question__btn">PREVIOUS</button>`);
    nextBtn = $(`<button class="question__next-btn question__btn">NEXT</button>`);
    flagBtn = $(`<button class="question__flag-btn question__btn"><img src="../../images/flag.png"></button>`);

    const submitBtnContainer = $(`<div class="submit-btn-container"></div>`);
    submitBtn = $(`<button class="exam__submit-btn question__btn">SUBMIT</button>`);
    submitBtnContainer.append(submitBtn);


    btnsContainer.append(prevBtn);
    btnsContainer.append(nextBtn);
    btnsContainer.append(flagBtn);

    questionsContainer.append(btnsContainer);
    questionsContainer.append(submitBtnContainer);

    flagBtn.on("click", flagQuestion);
    nextBtn.on("click", showNextQuestion);
    prevBtn.on("click", showPreviousQuestion);
    submitBtn.on("click", calculateUnansweredQuestions);

    questionContainer[0].style.display = "block";
    nextBtn.css("display", "inline");
    flagBtn.css("display", "inline");
    showAndHideBtns();
};


export const startExam = async () => {
    welcomeContainer.css("display", "none");
    examContainer.css("display", "flex");
    const questions = await $.getJSON('../../questions.json');
    initializeQuestions(questions);
    startTimer();
};

const startTimer = () => {
    $(".timer-container").css("display", "flex");
    const examDuration = 1 * 60;
    let remainingTime = examDuration;

    const progressBar = $('.progress');
    const timerText = $('.timer-text');

    const updateTimer = () => {
        if (remainingTime === 0) {
            clearInterval(timerInterval);
            timedOut();
        } else {
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

    timerInterval = setInterval(updateTimer, 1000);
};

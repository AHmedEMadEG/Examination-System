import { Question } from "../modules/Question.js";

const welcomeContainer = $('.welcome-container');
const examContainer = $('.exam-container');
const questionsContainer = $('.questions-container');
const flaggedContainer = $('.flagged-questions-container');

$('h1').addClass('animate__animated animate__zoomInUp');

let nextBtn = null;
let flagBtn = null;
let prevBtn = null;
let submitBtn = null;


let questionContainer = null;
let questionsArray = [];

let currentQuestion = 0;

let timerInterval = null;

let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

!loggedInUser && location.replace("../../pages/index.html");

loggedInUser && welcomeContainer.find('h1').text(
    `Welcome to the Examination System Eng/ ${loggedInUser.firstName} ${loggedInUser.lastName}`);

const calculateUnansweredQuestions = () => {
  const confirmation = confirm("are you sure you wanna submit the exam?");

  if (confirmation){
    let unansweredQuestions = 0;
    questionsArray.forEach((question) => {
        !question.selectedAnswer && unansweredQuestions++;
    });
    if(unansweredQuestions){
        confirm(`you haven't answered ${unansweredQuestions} question${unansweredQuestions === 1 ? '' : 's'}`) 
        && timedOut();
    }
  }
};


const calculateResult = () => {
    let correctAnswers = 0;
    questionsArray.forEach((question) => {
        (question.selectedAnswer === question.correctAnswer) && correctAnswers++;
        question.isCorrect = question.selectedAnswer === question.correctAnswer;
    });
    return correctAnswers;
};

const timedOut = () => {
    clearInterval(timerInterval);
    let _users = JSON.parse(localStorage.getItem("users"));

    _users = _users.map((user) => {
        if(loggedInUser.email === user.email){
            loggedInUser.lastScore = calculateResult();
             return {
                ...user,
                lastScore: loggedInUser.lastScore
            };
        }else{
            return {...user};
        }
    });
    localStorage.setItem("users", JSON.stringify(_users));
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    location.replace("../../pages/result.html");
};

// const createDomQuestion = (question, index) => {
//     const questionObj = new Question(question)
//     const questionContainer = $('<div class="question-container"></div>');
//     const body = $(`<h3 class='question-body'>${index + 1}. ${question.question_body}</h3>`);
//     questionContainer.append(body);
//     const ul = $(`<ul class='answers'></ul>`);
//     question.answers.forEach((answer, index) => {
//         const li = $(`<li><input type="radio" id="${index}_${answer}" 
//         name="${question.id}" value="${answer}"><label for="${index}_${answer}">${answer}</label></li>`);
//         li.on("change", (e) => {
//             questionObj.selectedAnswer = e.target.value; 
//         });
//         ul.append(li);
//     });
//     questionsArray.push(questionObj);
//     questionContainer.append(ul);
//     questionsContainer.append(questionContainer);
// };


const createDomQuestion = (question, index) => {
    const questionObj = new Question(question);
    const questionContainer = $('<div class="question-container"></div>');
    const body = $(`<h3 class='question-body'>${index + 1}. ${question.question_body}</h3>`);
    questionContainer.append(body);
    const ul = $(`<ul class='answers'></ul>`);
    question.answers.forEach((answer, i) => {
        const li = $(`<li><input type="radio" id="${index}_${i}" name="${question.id}" value="${answer}"> <label for="${index}_${i}">${answer}</label></li>`);
        li.on("click", () => {
            $(`input[name="${question.id}"]`).prop("checked", false);
            li.find('input').prop("checked", true);
            questionObj.selectedAnswer = answer;
            ul.find('li').removeClass('selected');
            li.addClass('selected');
        });


        li.on("click", (e) => {
            const radioButton = li.find('input[type="radio"]');
            radioButton.prop('checked', true);
            questionObj.selectedAnswer = radioButton.val();
            radioButton.style.color = "red";
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
    flagBtn = $(`<button class="question__flag-btn question__btn">FLAG</button>`);
    submitBtn = $(`<button class="exam__submit-btn">SUBMIT</button>`);

    btnsContainer.append(prevBtn);
    btnsContainer.append(nextBtn);
    btnsContainer.append(flagBtn);

    questionsContainer.append(btnsContainer);
    questionsContainer.append(submitBtn);
    
    flagBtn.on("click", flagQuestion);
    nextBtn.on("click", showNextQuestion);
    prevBtn.on("click", showPreviousQuestion);
    submitBtn.on("click", calculateUnansweredQuestions);

    questionContainer[0].style.display = "block";
    nextBtn.css("display", "inline");
    flagBtn.css("display", "inline");
    showAndHideBtns();
};


const startExam = async () => {
    // const confirmation = confirm("are you sure you wanna start the exam?");

    // if (confirmation) {
    welcomeContainer.css("display", "none");
    examContainer.css("display", "flex");
    const questions = await $.getJSON('../../questions.json');
    initializeQuestions(questions);
    startTimer();
    // }
};

// startExam(); // for testing

const startTimer = () => {
    $(".timer-container").css("display", "flex");
    const examDuration = 10 * 60;
    let remainingTime = examDuration;

    const progressBar = $('.progress');
    const timerText = $('.timer-text');

    const updateTimer = () => {
        if (remainingTime === 0) {
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


$("#button__start").on("click", startExam);

const showAndHideBtns = () => {
    currentQuestion ? prevBtn.css("display", "inline") : prevBtn.css("display", "none"); // if currentQuestion not 0 show else hide
    (currentQuestion === 9) ? nextBtn.css("display", "none") : nextBtn.css("display", "inline"); // if currentQuestion 9 hide else show
    questionsArray[currentQuestion].flagged ? flagBtn.text("Unflag") : flagBtn.text("Flag");
};

const showNextQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion + 1) % questionContainer.length; // 0 - length of questions
    questionContainer[currentQuestion].style.display = "block";

    showAndHideBtns();
};


const showPreviousQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion - 1 + questionContainer.length) % questionContainer.length; // length of questions - 0
    questionContainer[currentQuestion].style.display = "block";

    showAndHideBtns();
};

const flagQuestion = () => {
    questionsArray[currentQuestion].flagged = !questionsArray[currentQuestion].flagged;

    if (questionsArray[currentQuestion].flagged) {
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
    } else {
        flaggedContainer.children().each((index, element) => {
            if ($(element).text() === $(questionContainer[currentQuestion]).find('.question-body').text()) {
                flaggedContainer.children().eq(index).remove();
            }
        });
        !(flaggedContainer.children().length) && flaggedContainer.css("display", "none");
    }
    showAndHideBtns();
};

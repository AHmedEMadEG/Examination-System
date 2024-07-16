import { questionContainer, questionsArray, prevBtn, nextBtn, flagBtn} from "./ExamStart.js";

const flaggedContainer = $('.flagged-questions-container');

let currentQuestion = 0;


export const showAndHideBtns = () => {
    currentQuestion ? prevBtn.removeClass("btn-disabled").removeAttr("disabled") : prevBtn.addClass("btn-disabled").attr("disabled", "disabled"); // if currentQuestion not 0 show else hide
    (currentQuestion === 9) ? nextBtn.addClass("btn-disabled").attr("disabled", "disabled") : nextBtn.removeClass("btn-disabled").removeAttr("disabled"); // if currentQuestion 9 hide else show
    questionsArray[currentQuestion].flagged ? flagBtn.text("Unflag") : flagBtn.text("Flag");
};

export const showNextQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion + 1) % questionContainer.length; // 0 - length of questions
    questionContainer[currentQuestion].style.display = "block";

    showAndHideBtns();
};


export const showPreviousQuestion = () => {
    questionContainer[currentQuestion].style.display = "none";
    currentQuestion = (currentQuestion - 1 + questionContainer.length) % questionContainer.length; // length of questions - 0
    questionContainer[currentQuestion].style.display = "block";

    showAndHideBtns();
};

export const flagQuestion = () => {
    questionsArray[currentQuestion].flagged = !questionsArray[currentQuestion].flagged;

    if (questionsArray[currentQuestion].flagged) {
        !(flaggedContainer.children().length) && flaggedContainer.css("display", "block");
        const flaggedQuestion = $(`<div class="flagged-question">${currentQuestion + 1}</div>`);

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
            if ($(element).text() == (currentQuestion + 1)) {
                flaggedContainer.children().eq(index).remove();
            }
        });
        !(flaggedContainer.children().length) && flaggedContainer.css("display", "none");
    }
    showAndHideBtns();
};

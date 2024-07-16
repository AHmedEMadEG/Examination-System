import { questionsArray } from "./ExamStart.js"
import { loggedInUser } from "./exam.js"

export const calculateUnansweredQuestions = () => {
  const confirmation = confirm("are you sure you wanna submit the exam?");

  if (confirmation) {
    let unansweredQuestions = 0;
    questionsArray.forEach((question) => {
      !question.selectedAnswer && unansweredQuestions++;
    });
    if (unansweredQuestions) {
      confirm(
        `you haven't answered ${unansweredQuestions} question${
          unansweredQuestions === 1 ? "" : "s"
        }`
      ) && timedOut();
    } else {
      timedOut();
    }
  }
};

const calculateResult = () => {
  let correctAnswers = 0;
  questionsArray.forEach((question) => {
    question.selectedAnswer === question.correctAnswer && correctAnswers++;
    question.isCorrect = question.selectedAnswer === question.correctAnswer;
  });
  return correctAnswers;
};

export const timedOut = () => {
  let _users = JSON.parse(localStorage.getItem("users"));

  _users = _users.map((user) => {
    if (loggedInUser.email === user.email) {
      loggedInUser.lastScore = calculateResult();
      return {
        ...user,
        lastScore: loggedInUser.lastScore,
      };
    } else {
      return { ...user };
    }
  });
  localStorage.setItem("users", JSON.stringify(_users));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  location.replace("../../pages/result.html");
};

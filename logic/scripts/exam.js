const welcomeContainer = $('.welcome-container');
const examContainer = $('.exam-container');

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

welcomeContainer.find('h1').text(`Welcome to the Examination System Eng/ ${loggedInUser.firstName} ${loggedInUser.lastName}`);

const startExam = () => {
  confirm("are you sure you wanna start the exam?") && (welcomeContainer.css("display", "none")) && (examContainer.css("display",  "block"));
};

$("#button__signUp").on("click", startExam);

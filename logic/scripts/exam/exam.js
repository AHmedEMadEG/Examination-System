import { welcomeContainer , startExam} from "./ExamStart.js";


export let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

!loggedInUser && location.replace("../../pages/index.html");

loggedInUser && welcomeContainer.find('h1').text(
    `Welcome to the Examination System Eng/ ${loggedInUser.firstName} ${loggedInUser.lastName}`);


$("#button__start").on("click", startExam);


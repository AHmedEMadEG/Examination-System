let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

!loggedInUser && location.replace("../../pages/index.html");

$(".score").text(loggedInUser.lastScore);

localStorage.removeItem('loggedInUser');

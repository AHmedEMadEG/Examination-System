let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

!loggedInUser && location.replace("../../pages/index.html");

let mess = "";

(loggedInUser.lastScore >= 6) 
  ?( mess += `Congratulations ${loggedInUser.firstName} ${loggedInUser.lastName}, You successfully passed the exam`) 
  : mess += `${loggedInUser.firstName} ${loggedInUser.lastName}, Unfortunately you have failed the exam`;

$(".message__content").text(mess);
$(".message__img")[0].src = `../../images/${(loggedInUser.lastScore >= 6) ? "success" : "fail"}.png`;

$(".score__number__content").text(loggedInUser.lastScore);
$(".score__percentager__content").text(loggedInUser.lastScore * 10);

localStorage.removeItem('loggedInUser');



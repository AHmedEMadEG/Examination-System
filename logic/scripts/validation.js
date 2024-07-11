import { User } from "../modules/User.js";

const container = $(".container");
const fName = $("#input__fn");
const lName = $("#input__ln");
const signupEmail = $("#input__email");
const password = $("#input__password");
const rePassword = $("#input__re-password");
const signupSubmit = $("#button__signUp");
const loginEmail = $("#login__email");
const loginPassword = $("#login__password");
const loginSubmit = $("#button__login");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* */
const nameValidation = (htmlElement) => {
  const $input = $(htmlElement);
  const errorCondition =
    !$input.val() ||$input.val().split("").some((char) => !isNaN(char) && char !== " ") ||$input.val().length < 4 
    ||$input.val().length > 15;

  errorCondition && console.log($input.val());

  return errorCondition;
};

fName.on("change", (e) => {
  nameValidation(e.target);
});

lName.on("change", (e) => {
  nameValidation(e.target);
});

const emailValidation = (htmlElement) => {
  const $input = $(htmlElement);
  const errorCondition = !$input.val() || !emailRegex.test($input.val());

  errorCondition && console.log($input.val());

  return errorCondition;
};

signupEmail.on("change", (e) => emailValidation(e.target));

loginEmail.on("change", (e) => emailValidation(e.target));

const passwordValidation = (htmlElement) => {
  const $input = $(htmlElement);
  const errorCondition =
    !$input.val() || $input.val().length < 8 || $input.val().length > 15;

  errorCondition && console.log($input.val());

  return errorCondition;
};

password.on("change", (e) => passwordValidation(e.target));

loginPassword.on("change", (e) => passwordValidation(e.target));


signupSubmit.on("click", (e) => {
  e.preventDefault();
  const fNameError = nameValidation(fName[0]);
  const lNameError = nameValidation(lName[0]);
  const emailError = emailValidation(signupEmail[0]);
  const passwordError = passwordValidation(password[0]);
  const rePasswordError = rePassword.val() !== password.val();

  let _users = JSON.parse(localStorage.getItem("users")) || [];
  const duplicatedEmailError = _users.some(user => user.email === signupEmail[0].value);

  rePasswordError && console.log(rePassword.val());
  duplicatedEmailError && console.log("email exists!");

  if (!fNameError && !lNameError && !emailError && !passwordError && !rePasswordError && !duplicatedEmailError) {
    const fn = fName.val();
    const ln = lName.val();
    const e = signupEmail.val();
    const p = password.val();
    const user = new User(fn, ln, e, p);

    _users.push(user) && localStorage.setItem("users", JSON.stringify(_users));

    container.toggleClass("active");

    fName.val("");
    lName.val("");
    signupEmail.val("");
    password.val("");
    rePassword.val("");
  }
});

loginSubmit.on("click", (e) => {
  e.preventDefault();
  const emailError = emailValidation(loginEmail[0]);
  const passwordError = passwordValidation(loginPassword[0]);

  if (!emailError && !passwordError) {
    const e = loginEmail.val();
    const p = loginPassword.val();
    let validationError = true;
    const _users = JSON.parse(localStorage.getItem('users'));

    _users.forEach(user => {
      if (e === user.email && p === user.password) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        location.replace("../../pages/exam.html");
        validationError = false;
      }
    });
    validationError && console.log("wrong email or password");
  }
});

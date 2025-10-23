const progressBarTrack = document.querySelector(".password-progress-bar");
const progressBarFilled = document.querySelector(
  ".password-progress-bar-filled"
);
const progressBarCircle = document.querySelector(".progress-bar-circle");

//pasword steps

const passwordLengthValue = document.querySelector(
  ".current-password-length-value"
);

//Password Criteria

let passWordCriteriaPattern = [];

let lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
let upperCaseLetters = lowerCaseLetters.toLocaleUpperCase();
let numbers = "0123456789";
let symbols = '!@#$%^&*()_+-=[]{}|;:",.<>?/~`';

passWordCriteriaPattern.push(lowerCaseLetters, numbers);

passWordCriteriaPattern = passWordCriteriaPattern.join("");
//passwordStrength Visual indicators

const passwordStrengthIndicators = [
  ...document.querySelectorAll(".password-strength-box"),
];

const passwordStrengthLabel = document.querySelector(
  ".password-strength-value"
);

console.log(passwordStrengthLabel, "password strength label");
//Password Generate button

const generatePasswordBtn = document.querySelector(".generetate-password-btn");

let isDragging = false;
//dragging steps
let currentStep = 0;
let totalSteps = 20;

//start drag

progressBarCircle.addEventListener("mousedown", () => {
  isDragging = true;

  //set cursor to grab cursor only when dragging
  if (isDragging) document.documentElement.style.cursor = "grab";
  document.body.style.userSelect = "none";
});

progressBarCircle.addEventListener("dragstart", (e) => {
  //remove default drag styles
  e.preventDefault();
});

//End Drag
document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.userSelect = "auto";

  //reset cursor to pointer
  document.documentElement.style.cursor = "pointer";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  //distance values and width values from top left side of page to left side of track div
  const barRect = progressBarTrack.getBoundingClientRect();

  //this gets the distance fom the left edge of the bar to current mouse X value
  const offsetX = e.clientX - barRect.left;

  let percent = Math.min(Math.max(offsetX / barRect.width, 0), 1);

  //convert the current step wole number
  const step = Math.round(percent * totalSteps);

  //update the current step
  currentStep = step;

  //update UI

  const newPercent = step / totalSteps;

  progressBarFilled.style.width = `${newPercent * 100}%`;
  progressBarCircle.style.left = `${newPercent * 100}%`;

  passwordLengthValue.textContent = currentStep;

  return currentStep;
});

//run generate password function when button is clicked
generatePasswordBtn.addEventListener("click", () =>
  generatePassword(currentStep)
);

function generatePassword(passwordLength) {
  //intialise result password
  let result = "";
  for (let i = 0; i < passwordLength; i++) {
    //generates a random index to pick from when looking at the password pattern
    const randomIndex = Math.floor(
      Math.random() * passWordCriteriaPattern.length
    );

    result += passWordCriteriaPattern.charAt(randomIndex);
  }

  //once the loop is done finalPassword is assigned to the result

  let finalPassword = result;
  renderPasswordToUi(finalPassword);

  let passwordStrengthValue;

  if (passwordLength === 0) return;

  if (passwordLength < 5) {
    //change value
    passwordStrengthValue = "Very Weak";
    //set attribute
    passwordStrengthLabel.setAttribute("data-strength", "Very Weak");
  } else if (passwordLength < 10) {
    //Change value
    passwordStrengthValue = "Weak";
    //set attribute
    passwordStrengthLabel.setAttribute("data-strength", "Weak");
  } else if (passwordLength < 15) {
    //change value
    passwordStrengthValue = "Medium";
    //set attribute
    passwordStrengthLabel.setAttribute("data-strength", "Medium");
  } else if (passwordLength < 20) {
    //change value
    passwordStrengthValue = "Strong";
    //set attribute
    passwordStrengthLabel.setAttribute("data-strength", "Strong");
  }

  //update strength label
  passwordStrengthLabel.textContent = passwordStrengthValue.toLocaleUpperCase();
}

function renderPasswordToUi(password) {
  const renderedPassword = document.querySelector(".generated-password");

  renderedPassword.classList.add("rendered");
  console.log(renderedPassword);
}

//
// DOM ELEMENTS
//

const progressBarTrack = document.querySelector(".password-progress-bar");
const progressBarFilled = document.querySelector(
  ".password-progress-bar-filled"
);
const progressBarCircle = document.querySelector(".progress-bar-circle");
const passwordLengthValue = document.querySelector(
  ".current-password-length-value"
);
const passwordStrengthLabel = document.querySelector(
  ".password-strength-value"
);
const generatePasswordBtn = document.querySelector(".generetate-password-btn");

const renderedPassword = document.querySelector(".generated-password");

const copyPasswordButton = document.querySelector(".copy-password-btn");

console.log(copyPasswordButton);
//
//  PASSWORD CRITERIA
//

const criteriaCheckboxes = [
  ...document.querySelectorAll("input[type='checkbox']"),
];
console.log(criteriaCheckboxes);

let initialPasswordCriteria = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "123456789",
  '!@#$%^&*()_+-=[]{}|;:",.<>?/~`',
];

let passWordCriteriaPattern = [];

//
//STATE VARIABLES
//

let isDragging = false;
let currentStep = 0;
let totalSteps = 20;

//
// EVENT LISTENERS
//

// Password criteria selection
criteriaCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", (e) => choosePasswordCriteria(e));
});

// Drag start
progressBarCircle.addEventListener("mousedown", () => {
  isDragging = true;
  if (isDragging) document.documentElement.style.cursor = "grab";
  document.body.style.userSelect = "none";
});

// Disable default drag behavior
progressBarCircle.addEventListener("dragstart", (e) => e.preventDefault());

// Drag end
document.addEventListener("mouseup", () => {
  //reset values when mouse is not pressed
  isDragging = false;
  document.body.style.userSelect = "auto";
  document.documentElement.style.cursor = "pointer";
});

// Drag move
document.addEventListener("mousemove", onDrag);

// Generate password button click
generatePasswordBtn.addEventListener("click", () =>
  generatePassword(currentStep, passWordCriteriaPattern)
);

//copy password to clipboard

copyPasswordButton.addEventListener("click", copyPasswordToClipBoard);

//
// MAIN FUNCTIONS
//

function choosePasswordCriteria() {
  passWordCriteriaPattern = [];
  criteriaCheckboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      passWordCriteriaPattern.push(initialPasswordCriteria[index]);
    }
    return passWordCriteriaPattern;
  });
}

function onDrag(e) {
  if (!isDragging) return;

  const barRect = progressBarTrack.getBoundingClientRect();
  const offsetX = e.clientX - barRect.left;
  let percent = Math.min(Math.max(offsetX / barRect.width, 0), 1);
  const step = Math.round(percent * totalSteps);
  currentStep = step;

  const newPercent = step / totalSteps;
  progressBarFilled.style.width = `${newPercent * 100}%`;
  progressBarCircle.style.left = `${newPercent * 100}%`;
  passwordLengthValue.textContent = currentStep;

  return currentStep;
}

function generatePassword(passwordLength) {
  if (passwordLength === 0) {
    alert("password can't be 0 in length");
    return;
  }

  if (criteriaCheckboxes.every((checkbox) => !checkbox.checked)) {
    alert("At least one checkbox must be checked");
    return;
  }

  const passWordCriteriaPatternString = passWordCriteriaPattern.join("");
  let result = "";

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(
      Math.random() * passWordCriteriaPatternString.length
    );
    result += passWordCriteriaPatternString.charAt(randomIndex);
  }

  let finalPassword = result;
  renderPasswordToUi(finalPassword);

  let passwordStrengthValue;
  if (passwordLength === 0) return;

  if (passwordLength < 5) {
    passwordStrengthValue = "Very Weak";
    passwordStrengthLabel.setAttribute("data-strength", "Very Weak");
  } else if (passwordLength < 10) {
    passwordStrengthValue = "Weak";
    passwordStrengthLabel.setAttribute("data-strength", "Weak");
  } else if (passwordLength < 15) {
    passwordStrengthValue = "Medium";
    passwordStrengthLabel.setAttribute("data-strength", "Medium");
  } else if (passwordLength < 20) {
    passwordStrengthValue = "Strong";
    passwordStrengthLabel.setAttribute("data-strength", "Strong");
  }

  passwordStrengthLabel.textContent = passwordStrengthValue.toLocaleUpperCase();
}

//
//  HELPER FUNCTIONS
//
function renderPasswordToUi(password) {
  renderedPassword.textContent = password;
  renderedPassword.classList.add("rendered");
  console.log(renderedPassword.classList, "classlist");
}

function copyPasswordToClipBoard() {
  //copy user password to clipboard
  const password = renderedPassword.textContent;

  navigator.clipboard
    .writeText(password)
    .then(() => {
      console.log("Copied!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

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
const generatePasswordBtn = document.querySelector(".generate-password-btn");
const renderedPassword = document.querySelector(".generated-password");
const copyPasswordButton = document.querySelector(".copy-password-btn");
const copiedMessage = document.querySelector(".copied-message");

//
// PASSWORD CRITERIA
//
const criteriaCheckboxes = [
  ...document.querySelectorAll("input[type='checkbox']"),
];
const initialPasswordCriteria = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "123456789",
  "!@#$%^&*()_+-=[]{}|;:',.<>?/~`",
];

let passWordCriteriaPattern = [];

//
// STATE VARIABLES
//
let isDragging = false;
let currentStep = 0;
const totalSteps = 20;

//
// EVENT LISTENERS
//

// Password criteria selection
criteriaCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", choosePasswordCriteria);
});

// Drag start
progressBarCircle.addEventListener("mousedown", () => {
  isDragging = true;
  document.documentElement.style.cursor = "grabbing";
  document.body.style.userSelect = "none";
});

// Disable default drag behavior
progressBarCircle.addEventListener("dragstart", (e) => e.preventDefault());

// Drag end
document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.userSelect = "auto";
  document.documentElement.style.cursor = "pointer";
  progressBarCircle.classList.remove("being-dragged");
});

// Drag move
document.addEventListener("mousemove", onDrag);

// Generate password
generatePasswordBtn.addEventListener("click", () => {
  generatePassword(currentStep, passWordCriteriaPattern);
});

// Copy password
copyPasswordButton.addEventListener("click", copyPasswordToClipBoard);

//
// MAIN FUNCTIONS
//
function choosePasswordCriteria() {
  passWordCriteriaPattern = [];
  criteriaCheckboxes.forEach((checkbox, index) => {
    if (checkbox.checked)
      passWordCriteriaPattern.push(initialPasswordCriteria[index]);
  });
}

function onDrag(e) {
  if (!isDragging) return;

  changeDragCursorStyle();

  const barRect = progressBarTrack.getBoundingClientRect();
  const offsetX = e.clientX - barRect.left;
  const percent = Math.min(Math.max(offsetX / barRect.width, 0), 1);
  currentStep = Math.round(percent * totalSteps);

  const newPercent = currentStep / totalSteps;
  progressBarFilled.style.width = `${newPercent * 100}%`;
  progressBarCircle.style.left = `${newPercent * 100}%`;
  passwordLengthValue.textContent = currentStep;

  return currentStep;
}

function generatePassword(passwordLength, passWordCriteriaPattern) {
  // Reset copy message
  copiedMessage.style.display = "none";

  // Validation
  if (!Number.isInteger(passwordLength) || passwordLength <= 0) {
    alert("Please enter a valid password length greater than 0.");
    return;
  }
  if (passwordLength > 20) {
    alert("Password length can't exceed 20 characters");
    return;
  }
  if (criteriaCheckboxes.every((checkbox) => !checkbox.checked)) {
    alert("At least one checkbox must be checked");
    return;
  }

  // Generate password
  const patternString = passWordCriteriaPattern.join("");
  let result = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * patternString.length);
    result += patternString[randomIndex];
  }

  renderPasswordToUi(result);
  updatePasswordStrength(passwordLength);
}

//
// HELPER FUNCTIONS
//
function renderPasswordToUi(password) {
  renderedPassword.textContent = password;
  renderedPassword.classList.add("rendered");
}

function updatePasswordStrength(passwordLength) {
  let label = "Very Weak";

  if (passwordLength >= 15) label = "Strong";
  else if (passwordLength >= 10) label = "Medium";
  else if (passwordLength >= 5) label = "Weak";

  passwordStrengthLabel.textContent = label.toUpperCase();
  passwordStrengthLabel.setAttribute("data-strength", label);
}

function copyPasswordToClipBoard() {
  const password = renderedPassword.textContent.trim();
  if (!password) {
    alert("Nothing to copy! Generate a password first.");
    return;
  }

  navigator.clipboard
    .writeText(password)
    .then(() => {
      copiedMessage.style.display = "block";
      copiedMessage.textContent = "Copied!";
    })
    .catch((err) => {
      console.error("Failed to copy password:", err);
    });
}

function changeDragCursorStyle() {
  progressBarCircle.classList.add("being-dragged");
}

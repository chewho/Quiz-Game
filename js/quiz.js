let correctAnswer;
let correctNumber = localStorage.getItem("quiz_game_correct") ? localStorage.getItem("quiz_game_correct") : 0;
let incorrectNumber = localStorage.getItem("quiz_game_incorrect") ? localStorage.getItem("quiz_game_incorrect") : 0;

document.addEventListener("DOMContentLoaded", function () {
  loadQuestion();

  eventListeners();
});

eventListeners = () => {
  document.querySelector("#check-answer").addEventListener("click", validateAnswer);
  document.querySelector("#clear-storage").addEventListener("click", clearResults);
};

// Loads a new question from an API
loadQuestion = () => {
  fetch("https://opentdb.com/api.php?amount=1")
    .then((data) => data.json())
    .then((result) => displayQuestion(result.results));
};

displayQuestion = (questions) => {
  const questionHTML = document.createElement("div");
  questionHTML.classList.add("col-12");

  questions.forEach((question) => {
    correctAnswer = question.correct_answer;
    let possibleAnswers = question.incorrect_answers;
    possibleAnswers.splice(Math.floor(Math.random() * 3), 0, correctAnswer);

    // Add the current question to the HTML
    questionHTML.innerHTML = `
    <div class='row justify-content-between heading'>
      <p class='category'>Category: ${question.category}</p>
      <div class='totals'>
        <span class='badge badge-success'>${correctNumber}</span>
        <span class='badge badge-danger'>${incorrectNumber}</span>
      </div>
    </div>
    <h2 class='text-center'>${question.question}</h2>
    `;

    // Generate the HTML for possible answers
    const answerDiv = document.createElement("div");
    answerDiv.classList.add("questions", "row", "justify-content-around", "mt-4");
    possibleAnswers.forEach((answer) => {
      const answerHTML = document.createElement("li");
      answerHTML.classList.add("col-12", "col-md-5");
      answerHTML.textContent = answer;
      // Attach an event click the answer is clicked
      answerHTML.onclick = selectAnswer;
      answerDiv.appendChild(answerHTML);
    });
    questionHTML.appendChild(answerDiv);
    document.querySelector("#app").appendChild(questionHTML);
  });
};

// When the answer is selected
selectAnswer = (e) => {
  // Remove the previous active class
  const active = document.querySelector(".active");
  e.target.classList.toggle("active");

  if (active) {
    active.classList.remove("active");
  }
};

// Checks if the active class is ON
validateAnswer = () => {
  if (document.querySelector(".questions .active")) {
    checkAnswer();
  } else {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("alert", "alert-danger", "col-md-6");
    errorDiv.textContent = "Please select 1 answer";
    const questionDiv = document.querySelector(".questions");
    questionDiv.appendChild(errorDiv);

    // Remove the error
    setTimeout(() => {
      document.querySelector(".alert-danger").remove();
    }, 2000);
  }
};

// Check if the answer is correct
checkAnswer = () => {
  const userAnswer = document.querySelector(".questions .active");
  if (userAnswer.textContent === correctAnswer) {
    correctNumber++;
  } else {
    incorrectNumber++;
  }

  // Save into local storage
  saveIntoStorage();

  // Clear previos question
  const app = document.querySelector("#app");
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  // Load the new question
  loadQuestion();
};

// Save into local storage
saveIntoStorage = () => {
  localStorage.setItem("quiz_game_correct", correctNumber);
  localStorage.setItem("quiz_game_incorrect", incorrectNumber);
};

// Clear the results from local storage
clearResults = () => {
  localStorage.setItem("quiz_game_correct", 0);
  localStorage.setItem("quiz_game_incorrect", 0);

  setTimeout(() => {
    window.location.reload();
  }, 500);
};

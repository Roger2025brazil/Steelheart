let currentQuestionIndex = 0;
let correctScore = 0;
let incorrectScore = 0;

let questions = []; // Loaded dynamically from JSON file
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const confirmButton = document.getElementById("confirm-button");
const nextButton = document.getElementById("next-button");
const scoreContainer = document.getElementById("score-container");

// NEW: Create an element to display the explanation
const explanationContainer = document.createElement("div");
explanationContainer.id = "explanation-container";
explanationContainer.style.marginTop = "20px";
explanationContainer.style.color = "#ffffff";
document.getElementById("game-container").appendChild(explanationContainer);

function loadQuestion() {
  const question = questions[currentQuestionIndex];
  questionText.textContent = question.question;
  optionsContainer.innerHTML = "";
  explanationContainer.textContent = ""; // Clear previous explanation
  
  question.options.forEach((option, index) => {
    const button = document.createElement("div");
    button.textContent = option;
    button.classList.add("option");
    button.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(button);
  });
}

let selectedOptionIndex = null;

function selectOption(index) {
  selectedOptionIndex = index;
  document.querySelectorAll(".option").forEach((opt, i) => {
    opt.classList.toggle("selected", i === index);
  });
  confirmButton.disabled = false;
}

confirmButton.addEventListener("click", () => {
  const question = questions[currentQuestionIndex];
  const options = document.querySelectorAll(".option");
  
  if (selectedOptionIndex === question.correctIndex) {
    options[selectedOptionIndex].classList.add("correct");
    correctScore++;
    // Display explanation
    explanationContainer.textContent = "Explanation: " + question.explanation;
  } else {
    options[selectedOptionIndex].classList.add("incorrect");
    incorrectScore++;
  }
  
  scoreContainer.innerHTML = `
    Acertos: ${correctScore} | Erros: ${incorrectScore} | Porcentagem: ${((correctScore / (correctScore + incorrectScore)) * 100).toFixed(0)}%
  `;
  
  confirmButton.style.display = "none";
  nextButton.style.display = "block";
});

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    confirmButton.style.display = "block";
    nextButton.style.display = "none";
    confirmButton.disabled = true;
  } else {
    questionText.textContent = "Fim do Jogo!";
    optionsContainer.innerHTML = "";
    explanationContainer.textContent = "";
    confirmButton.style.display = "none";
    nextButton.style.display = "none";
  }
});

document.getElementById("file-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      // Parseia o conteúdo do JSON
      questions = JSON.parse(e.target.result);

      // Verifica se o JSON tem perguntas válidas
      if (questions.length > 0 && questions[0].question && questions[0].options) {
        currentQuestionIndex = 0;
        correctScore = 0;
        incorrectScore = 0;

        loadQuestion(); // Carrega a primeira pergunta
        confirmButton.style.display = "block";
        nextButton.style.display = "none";
        confirmButton.disabled = true;
      } else {
        alert("O arquivo JSON não tem perguntas válidas. Verifique a estrutura do arquivo.");
      }
    } catch (error) {
      alert("Erro ao carregar o arquivo JSON. Certifique-se de que é um arquivo JSON válido.");
      console.error(error);
    }
  };

  reader.readAsText(file);
});
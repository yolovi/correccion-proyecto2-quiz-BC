//console.log(8)
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");

const questions = [
  {
    question: "What is 2 + 2?",
    answers: [
      { text: "4", correct: true },
      { text: "22", correct: false },
    ],
  },
  {
    question: "Is web development fun?",
    answers: [
      { text: "Kinda", correct: false },
      { text: "YES!!!", correct: true },
      { text: "Um no", correct: false },
      { text: "IDK", correct: false },
    ],
  },
  {
    question: "What is 4 * 2?",
    answers: [
      { text: "6", correct: false },
      { text: "8", correct: true },
      { text: "Yes", correct: false },
    ],
  },
];

//EMPIEZA EL JUEGO - START -
let currentQuestionIndex;
function startGame() {
    startButton.classList.add("hide")
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove("hide");
    setNextQuestion();
}

startButton.addEventListener("click", startGame);

//MUESTRA LA PREGUNTA
function showQuestion (preguntaConcurso) {
    questionElement.innerText = preguntaConcurso.question;
    preguntaConcurso.answers.forEach(answer => { //recorremos todas las respuestas
        const button = document.createElement("button");
        button.innerText = answer.text;
        if (answer.correct) {
            button.dataset.correct = true;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button); //se agrega el botón al contenedor de respuestas
    })
}

//INDEXAMOS LAS PREGUNTAS PARA SABER CUÁNDO 'NEXT' Y CUÁNDO 'RESTART'
function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

//ESTABLECEMOS SI ELEMENTO CLICKADO ES CORRECTO
function setStatusClass(element) {
    if (element.dataset.correct) { //ver en HTML, los atributos data-* permiten almacenar info personalizada. 
    // Accedemos al valor de data-correct.
        element.classList.add("correct");
    } else {
    element.classList.add ("wrong")
    }
}

function selectAnswer() {
    Array.from(answerButtonsElement.children).forEach(button => { //recorremos botones de respuesta. Convertimos HTML Collection en un 
       // array para poder usar forEach
        setStatusClass(button);
    })
    if (questions.length > currentQuestionIndex + 1) { //si hay 8 preguntas, hasta la 7 nos saldrá el "next"
        nextButton.classList.remove("hide") //muestra "next"
    } else {
    startButton.innerText = "Restart";
    startButton.classList.remove("hide") //muestra "restart"
    }
}

nextButton.addEventListener("click",() => { //cuando clickas "next" sumas uno al contador de preguntas y ejecutas setNext Question
    currentQuestionIndex++;
    setNextQuestion();
});

function resetState(){
    nextButton.classList.add("hide"); //borramos las respuestas escritas
    answerButtonsElement.innerHTML="" //borramos todo el contenido HTML interno del elemento
}


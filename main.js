//console.log(8)
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const alerta = document.getElementById("alerta")


//constantes de la vista-inicio y la vista-quiz
const vistaInicio = document.getElementById("vista-inicio");
const buttonStartQuiz = document.getElementById("start-quiz");
const vistaQuiz = document.getElementById("vista-quiz")
const buttonVolverInicio = document.getElementById("volver-inicio");

/**
 * CORRECCION:
 *  esta API_URL no es escalable, en este ejercicio te vale al ser muy sencillo.
 *  Pero ten presente que la forma adecuada sería tener en una constante la base de la Url y después añadir lo que se vaya necesitando:
 * API_URL_BASE = "https://opentdb.com/api.php?"
 * Y antes de usarlo desde cualquier punto de la aplicación crearíamos la url adecuada
 * const cantidad = 10; tipo = "multiple";
 * const apiUrl = `${API_URL_BASE}amount=${cantidad}&type=${tipo}`;
 */ 

/*Guardadmos la API en una constante
const API_URL = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple" */

/**
 * CORRECCION:
 * el orden es: elementos DOM, variables, eventos y funciones.
 */ 
//funciones y addEventListener de vista-inicio y vista-quiz
function mostrarQuiz() {
  vistaInicio.classList.add("d-none");
  buttonStartQuiz.classList.add("d-none");
  vistaQuiz.classList.remove("d-none");
  buttonVolverInicio.classList.remove("d-none");
  nextButton.classList.add("d-none");
}

function mostrarInicio() {
  vistaQuiz.classList.add("d-none");
  buttonVolverInicio.classList.add("d-none");
  vistaInicio.classList.remove("d-none");
  buttonStartQuiz.classList.remove("d-none");
  reiniciarQuiz();
}

function reiniciarQuiz() {
  currentQuestionIndex = 0;
  preguntas = [];
  questionElement.innerHTML = "";
  answerButtonsElement.innerHTML = "";
  nextButton.classList.add("d-none");
  startButton.classList.remove("d-none");
  questionContainerElement.classList.add("d-none");
  alerta.classList.add("d-none");
}

/**
 * CORRECCION:
 * no damos un evento a cada elemento. Utilizamos la delegación de eventos: damos el evento a un elemento común (normalmente el body) y después en el evento comprobamos quien lo disparó
 */ 
buttonStartQuiz.addEventListener("click", mostrarQuiz);
buttonVolverInicio.addEventListener("click", mostrarInicio)


let currentQuestionIndex = 0;
let preguntas = [] //almacenamos las preguntas

/**
 * CORRECCION:
 * en esta funcion no nos interesa hacer nada que no sea llamar a la api: haces la llamada, recibes datos, devuelves datos con un return.
 * Una vez has devuelto los datos, desde donde llamaste a esta funcion ya harás lo que quieras y llamarás a las funciones que quieras,
 * pero desde dentro no llamas a la ejecucion de otras funciones.
 */ 
//Petición a la API con axios (devuelve promesa aunque no se vea). Manejo de la respuesta de la promesa con async/await:
async function getAPIInfo() {
  try {
    const datosApi = await axios.get("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
    preguntas = datosApi.data.results; //preguntas aquí es una categoría/cajita donde se guardan las preguntas y respuestas 
    currentQuestionIndex = 0; //primera pregunta
    /*  console.log(datosApi); */
    cargarPreguntaYRespuestas(preguntas[currentQuestionIndex])
  } catch (error) {
    console.error("Error", error);
  }
}

// Creamos variable para guardar preguntas y respuestas
const cargarPreguntaYRespuestas = (pregunta) => { //le pasamos a la función un parámetro "pregunta" que es el objeto que contiene los datos de la API
  questionElement.innerHTML = pregunta.question; //muestra pregunta en pantalla. Accedemos al campo question de cada objeto individual.
  answerButtonsElement.innerHTML = ""; // limpia respuestas anteriores

/**
 * CORRECCION:
 *  no has cerrado la funcion anterior, por lo que este evento lo tienes dentro de ella y es el evnto que llama a la funcion
 *  que a su vez llama a la funcion anterior. Sé más ordenado para evitar este tipo de cosas.s
 */ 
//Asociar el botón start a función que hace la llamada a la API
startButton.addEventListener("click", async() => {
  console.log('desde el evento')
  startButton.classList.add("d-none");
  questionContainerElement.classList.remove("d-none");
  getAPIInfo();

})

//Creamos función mostrarAlerta para desocultar la alerta (está oculta durante todo el quiz)
function mostrarAlerta() {
  alerta.classList.remove("d-none");
}


//Vinculamos el "next" button con la siguiente posición del índice de preguntas (excepto en la última posición/pregunta -> alerta)
nextButton.addEventListener("click", () => {
  currentQuestionIndex++; //se mueve una posición el contador de preguntas
  if (currentQuestionIndex < preguntas.length) {
    cargarPreguntaYRespuestas(preguntas[currentQuestionIndex]);
  } else {
    mostrarAlerta(); //mostrar alerta de Well done!
  }
});

  // Combina y mezcla las respuestas
  const respuestas = pregunta.incorrect_answers.concat(pregunta.correct_answer); //const respuestas genera un array
  respuestas.sort(() => Math.random() - 0.5); 
  //Math.random genera número aleatorio entre el rango [0-1[ , resta -0,5 con lo cual el rango es positivo o negativo, lo cual permite a sort
  //reordenar aleatoriamente

  //vamos entrando en cada una de las respuestas para pintarlas, crear un botón para cada una
  respuestas.forEach((respuesta) => {
    const button = document.createElement("button");
    button.innerText = respuesta;
    button.classList.add("btn", "btn-outline-secondary", "my-4", "respuesta-quiz"); //añadimos clases a cada uno de los botones de respuesta
    if (respuesta === pregunta.correct_answer) {
      button.dataset.correct = "true";
    }
    button.addEventListener("click", seleccionarRespuesta);
    answerButtonsElement.appendChild(button);
  });
  nextButton.classList.add("d-none");
}

// Verifica si la respuesta es correcta o incorrecta
function seleccionarRespuesta(e) {
  const selectedButton = e.target; //e.target es el elemento HTML exacto que disparó el evento
  const correct = selectedButton.dataset.correct === "true";
  if (correct) {
    selectedButton.style.backgroundColor = "green";
  } else {
    selectedButton.style.backgroundColor = "red";
  }
  Array.from(answerButtonsElement.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.style.border = "2px solid green";
    }
    button.disabled = true;
  });

  nextButton.classList.remove("d-none");
}




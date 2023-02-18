const quizData = [
    {
      question: "What is the name of the elven city in 'The Lord of the Rings'?",
      a: "Rivendell",
      b: "Minas Tirith",
      c: "Mirkwood",
      d: "Isengard",
      correct: "a"
    },
    {
      question: "What is the name of the wizard who founded Hogwarts School of Witchcraft and Wizardry?",
      a: "Dumbledore",
      b: "Grindelwald",
      c: "Merlin",
      d: "Rowena",
      correct: "d"
    },
    {
      question: "What is the name of the magical creature that is said to grant wishes?",
      a: "Unicorn",
      b: "Dragon",
      c: "Phoenix",
      d: "Fairy",
      correct: "a"
    }
  ];
  
  const quizContainer = document.getElementById('quiz');
  const resultsContainer = document.getElementById('results');
  const submitButton = document.getElementById('submit');
  
  let currentQuestion = 0;
  let numCorrect = 0;
  
  function buildQuiz() {
    const currentQuestionData = quizData[currentQuestion];
    const answers = [];
    for (letter in currentQuestionData) {
      if (letter !== 'question' && letter !== 'correct') {
        answers.push(
          `<label>
            <input type="radio" name="question" value="${letter}">
            ${letter}: ${currentQuestionData[letter]}
          </label>`
        );
      }
    }
    quizContainer.innerHTML = `
      <div class="question" style="text-align:center"> ${currentQuestionData.question} </div>
      <div class="answers" style="text-align:center"> ${answers.join('')} </div>
    `;
  }
  
  function showResults() {
    const answerContainer = quizContainer.querySelector('.answers');
    const selector = `input[name=question]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    if (userAnswer === quizData[currentQuestion].correct) {
      numCorrect++;
      answerContainer.style.color = 'lightgreen';
    } else {
      answerContainer.style.color = 'red';
    }
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      buildQuiz();
    } else {
      resultsContainer.innerHTML = `${numCorrect} out of ${quizData.length}`;
      if (numCorrect === quizData.length) {
        const legoImage = document.createElement('img');
        legoImage.src = 'figur.jpg'; // change this URL to your image source
        legoImage.alt = 'Lego Brick';
        legoImage.style.width = '200px';
        legoImage.style.cursor = 'pointer';
        legoImage.addEventListener('click', () => {
          window.open(legoImage.src, '_blank', 'width=800,height=800');
        });
        resultsContainer.appendChild(legoImage);
      }
      submitButton.style.display = 'none';
    }
  }
  
  buildQuiz();
  
  submitButton.addEventListener('click', showResults);

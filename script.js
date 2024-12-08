let score = 0;
let currentQuestionIndex = 0;
let questions = [];

// Charger les données JSON et préparer le quiz
function startQuiz() {
  console.log('Démarrage du quiz...');
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement de data.json : ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Données JSON chargées :', data);

      // Fusionner les QCM et les questions ouvertes dans un seul tableau
      questions = [...data.qcm, ...data.open];

      // Masquer le message d'accueil et le bouton
      document.getElementById('welcome-message').classList.add('hidden');
      document.getElementById('start-quiz').classList.add('hidden');

      // Afficher le conteneur de questions
      document.getElementById('question-container').classList.remove('hidden');

      // Mettre à jour le score et afficher la première question
      updateScore();
      showQuestion(currentQuestionIndex);
    })
    .catch(error => {
      console.error('Erreur :', error);
      alert('Impossible de charger le quiz. Veuillez vérifier le fichier data.json.');
    });
}

// Afficher une question
function showQuestion(index) {
  if (index >= questions.length) {
    // Si toutes les questions sont terminées
    document.getElementById('question-container').innerHTML = `
      <p>Quiz terminé ! Ton score final est de ${score} / ${questions.length}.</p>
    `;
    console.log('Quiz terminé. Score final :', score);
    return;
  }

  const question = questions[index];
  const questionText = document.getElementById('question-text');
  const choicesContainer = document.getElementById('choices-container');
  const nextButton = document.getElementById('next-question');

  // Effacer le contenu précédent
  questionText.textContent = `${index + 1}. ${question.question}`;
  choicesContainer.innerHTML = '';

  // Vérifiez si c'est un QCM ou une question ouverte
  if (question.choices) {
    // Cas d'un QCM
    question.choices.forEach(choice => {
      const button = document.createElement('button');
      button.textContent = choice;
      button.onclick = () => checkAnswer(choice, question.answer);
      choicesContainer.appendChild(button);
    });
  } else {
    // Cas d'une question ouverte
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'open-answer';
    input.placeholder = 'Tapez votre réponse ici...';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Valider';
    submitButton.onclick = () => checkOpenAnswer(input.value, question.keywords, question.answer);

    choicesContainer.appendChild(input);
    choicesContainer.appendChild(submitButton);
  }

  // Désactiver le bouton "Suivant" tant qu'une réponse n'est pas donnée
  nextButton.disabled = true;
}

// Vérifier la réponse d'un QCM
function checkAnswer(choice, correctAnswer) {
  const buttons = document.querySelectorAll('#choices-container button');
  const nextButton = document.getElementById('next-question');

  // Désactiver tous les boutons après une réponse
  buttons.forEach(button => {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.style.background = '#4CAF50'; // Bonne réponse en vert
    } else if (button.textContent === choice) {
      button.style.background = '#F44336'; // Mauvaise réponse en rouge
    }
  });

  if (choice === correctAnswer) {
    score++;
    updateScore();
  }

  // Activer le bouton "Suivant"
  nextButton.disabled = false;
}

// Vérifier la réponse d'une question ouverte
function checkOpenAnswer(userAnswer, keywords, correctAnswer) {
    const nextButton = document.getElementById('next-question');
    const inputField = document.getElementById('open-answer');
  
    // Normaliser la réponse utilisateur
    const normalizedAnswer = userAnswer.trim().toLowerCase();
  
    // Vérifier si au moins un mot-clé est présent
    const isCorrect = keywords.some(keyword =>
      normalizedAnswer.includes(keyword.trim().toLowerCase())
    );
  
    inputField.disabled = true; // Désactiver le champ après validation
  
    if (isCorrect) {
      alert('Bonne réponse ! 🎉');
      score++;
      updateScore();
    } else {
      alert(`Mauvaise réponse. La bonne réponse était : ${correctAnswer}`);
    }
  
    nextButton.disabled = false; // Activer le bouton "Suivant"
  }
  

// Passer à la question suivante
function nextQuestion() {
  currentQuestionIndex++;
  showQuestion(currentQuestionIndex);
}

// Mettre à jour l'affichage du score
function updateScore() {
  document.getElementById('current-score').textContent = score;
}

// Afficher la section choisie
function showSection(sectionId) {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('hidden');
  });

  const selectedSection = document.getElementById(sectionId);
  selectedSection.classList.remove('hidden');
}

// Afficher la section "Quiz" par défaut au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  showSection('quiz');
});

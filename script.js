const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('#score');
const statusEl = document.querySelector('#status');
const resultLabel = document.querySelector('#resultLabel');
const startButton = document.querySelector('#startButton');
const restartButton = document.querySelector('#restartButton');
const questionDialog = document.querySelector('#questionDialog');
const questionCount = document.querySelector('#questionCount');
const questionTitle = document.querySelector('#questionTitle');
const answersEl = document.querySelector('#answers');
const feedbackEl = document.querySelector('#feedback');
const continueButton = document.querySelector('#continueButton');
const finalDialog = document.querySelector('#finalDialog');
const finalTitle = document.querySelector('#finalTitle');
const finalMessage = document.querySelector('#finalMessage');
const finalRestartButton = document.querySelector('#finalRestartButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const targetQuestions = 10;
const tickMs = 125;

const questionPool = [
  ['À 50 km/h, quelle distance minimale parcourt-on pendant 1 seconde de réaction ?', ['Environ 14 mètres', 'Environ 8 mètres', 'Environ 11 mètres'], 'Environ 14 mètres', 'À 50 km/h, le véhicule parcourt déjà près de 14 m avant même le début du freinage.'],
  ['Quel est le taux maximal d’alcool autorisé pour un conducteur novice en France ?', ['0,2 g/L de sang', '0,5 g/L de sang', '0,0 g/L de sang'], '0,2 g/L de sang', 'Le seuil légal est 0,2 g/L pour les permis probatoires et 0,5 g/L pour les autres conducteurs.'],
  ['Téléphoner au volant, même avec le téléphone en main seulement quelques secondes, provoque surtout...', ['Une baisse importante de l’attention', 'Uniquement une gêne si la route est inconnue', 'Un risque limité si la conversation est courte'], 'Une baisse importante de l’attention', 'Le téléphone détourne l’attention visuelle, manuelle et cognitive.'],
  ['En cas de pluie, il faut principalement...', ['Augmenter les distances de sécurité', 'Garder la même allure si les pneus sont récents', 'Freiner plus fort pour sécher les freins'], 'Augmenter les distances de sécurité', 'La chaussée mouillée allonge les distances de freinage et réduit l’adhérence.'],
  ['La fatigue au volant se manifeste souvent par...', ['Des bâillements, paupières lourdes et trajectoire moins précise', 'Une meilleure vigilance après minuit', 'Seulement des douleurs dans les jambes'], 'Des bâillements, paupières lourdes et trajectoire moins précise', 'Ces signes doivent conduire à s’arrêter et se reposer.'],
  ['Sur autoroute, la bande d’arrêt d’urgence sert...', ['Aux urgences, pannes ou forces d’intervention', 'À téléphoner tranquillement', 'À doubler si le trafic est dense'], 'Aux urgences, pannes ou forces d’intervention', 'Elle ne doit pas être utilisée comme voie de circulation ou de confort.'],
  ['Pour un casque de moto ou scooter, il faut...', ['Le porter attaché et homologué', 'Le poser sans l’attacher à faible vitesse', 'Le remplacer seulement s’il est rayé'], 'Le porter attaché et homologué', 'Un casque non attaché protège très mal en cas de choc.'],
  ['En ville, les usagers vulnérables sont notamment...', ['Piétons, cyclistes et utilisateurs de trottinettes', 'Uniquement les automobilistes débutants', 'Seulement les passagers arrière'], 'Piétons, cyclistes et utilisateurs de trottinettes', 'Ils sont moins protégés et plus exposés aux blessures graves.'],
  ['Avant de changer de voie, il faut...', ['Contrôler rétroviseurs, angle mort et clignotant', 'Mettre le clignotant après s’être déporté', 'Regarder seulement le rétroviseur intérieur'], 'Contrôler rétroviseurs, angle mort et clignotant', 'La vérification complète limite les collisions latérales.'],
  ['Un médicament avec pictogramme de conduite orange ou rouge signifie...', ['Qu’il peut altérer la conduite', 'Qu’il améliore la concentration', 'Qu’il est dangereux uniquement pour les passagers'], 'Qu’il peut altérer la conduite', 'Il faut lire la notice et demander conseil à un professionnel de santé.'],
  ['À l’approche d’un passage piéton, le bon réflexe est...', ['Ralentir et être prêt à s’arrêter', 'Accélérer si aucun piéton n’est déjà engagé', 'Klaxonner systématiquement'], 'Ralentir et être prêt à s’arrêter', 'Un piéton peut s’engager rapidement, surtout près des écoles ou arrêts de bus.'],
  ['La ceinture de sécurité est obligatoire...', ['À l’avant comme à l’arrière', 'Seulement sur autoroute', 'Uniquement pour le conducteur'], 'À l’avant comme à l’arrière', 'Chaque occupant doit être attaché, y compris sur les courts trajets.'],
  ['Pour transporter un enfant, il faut choisir...', ['Un dispositif adapté à son âge, sa taille et son poids', 'Une ceinture adulte dès qu’il sait s’asseoir', 'Le siège avant sans condition'], 'Un dispositif adapté à son âge, sa taille et son poids', 'Le système de retenue doit être adapté et correctement installé.'],
  ['La vitesse excessive augmente...', ['Le risque d’accident et la gravité des blessures', 'Uniquement la consommation de carburant', 'La visibilité dans les virages'], 'Le risque d’accident et la gravité des blessures', 'Plus la vitesse est élevée, plus le champ visuel diminue et le choc est violent.'],
  ['En cas de brouillard, il faut...', ['Réduire l’allure et augmenter les distances', 'Allumer les feux de route en continu', 'Suivre de près les feux du véhicule devant'], 'Réduire l’allure et augmenter les distances', 'Les feux de route peuvent éblouir par réflexion dans le brouillard.'],
  ['Un cycliste de nuit doit prioritairement...', ['Être visible avec éclairage et équipements réfléchissants', 'Rouler sans lumière sur les pistes cyclables', 'Porter seulement des vêtements sombres'], 'Être visible avec éclairage et équipements réfléchissants', 'Voir et être vu est essentiel, même en zone éclairée.'],
  ['Le clignotant sert à...', ['Informer les autres avant de changer de direction ou de voie', 'Obtenir la priorité automatiquement', 'Remplacer les contrôles visuels'], 'Informer les autres avant de changer de direction ou de voie', 'Il annonce l’intention, mais ne donne pas la priorité.'],
  ['Après un long repas alcoolisé, le café permet...', ['De rester éveillé, mais pas d’éliminer l’alcool plus vite', 'D’annuler l’alcoolémie', 'De conduire sans attendre'], 'De rester éveillé, mais pas d’éliminer l’alcool plus vite', 'Seul le temps fait baisser l’alcoolémie.'],
  ['Une distance de sécurité minimale sur route sèche correspond souvent à...', ['Au moins 2 secondes avec le véhicule précédent', 'La longueur d’une voiture', 'Une demi-seconde si l’on est attentif'], 'Au moins 2 secondes avec le véhicule précédent', 'Les 2 secondes donnent une marge de réaction minimale.'],
  ['Les écouteurs au volant ou au guidon sont...', ['Interdits car ils isolent des sons de circulation', 'Autorisés si un seul écouteur est porté', 'Obligatoires pour utiliser un GPS'], 'Interdits car ils isolent des sons de circulation', 'Ils réduisent la perception des avertissements et de l’environnement.'],
  ['À trottinette électrique, il faut...', ['Respecter les règles de circulation et rester visible', 'Rouler à deux pour être plus stable', 'Circuler toujours sur le trottoir'], 'Respecter les règles de circulation et rester visible', 'Les engins motorisés imposent une conduite prévisible et prudente.'],
  ['Un pneu sous-gonflé peut provoquer...', ['Perte d’adhérence, surconsommation et éclatement', 'Une distance de freinage plus courte', 'Une meilleure tenue sous la pluie'], 'Perte d’adhérence, surconsommation et éclatement', 'La pression doit être contrôlée régulièrement, à froid si possible.'],
  ['Le cannabis au volant...', ['Diminue les réflexes et augmente le risque d’accident', 'N’a d’effet que mélangé à l’alcool', 'Améliore la prudence du conducteur'], 'Diminue les réflexes et augmente le risque d’accident', 'Les stupéfiants sont incompatibles avec une conduite sûre.'],
  ['À moto, l’équipement protège surtout...', ['La tête, les mains, les pieds et la peau en cas de chute', 'Uniquement du froid', 'Seulement en trajet longue distance'], 'La tête, les mains, les pieds et la peau en cas de chute', 'Gants, blouson, pantalon et chaussures adaptés réduisent les blessures.'],
  ['Quand un véhicule prioritaire arrive sirène et gyrophare activés, il faut...', ['Faciliter son passage sans se mettre en danger', 'Accélérer devant lui', 'S’arrêter n’importe où immédiatement'], 'Faciliter son passage sans se mettre en danger', 'Il faut dégager prudemment et respecter les autres usagers.'],
  ['La somnolence est particulièrement dangereuse car...', ['Elle peut entraîner des micro-sommeils incontrôlables', 'Elle disparaît toujours fenêtre ouverte', 'Elle touche seulement les conducteurs âgés'], 'Elle peut entraîner des micro-sommeils incontrôlables', 'Une pause avec repos réel est la solution sûre.'],
  ['Avant un trajet, préparer son itinéraire aide à...', ['Réduire le stress et les manipulations du GPS en roulant', 'Pouvoir ignorer la signalisation', 'Rouler plus vite pour gagner du temps'], 'Réduire le stress et les manipulations du GPS en roulant', 'Anticiper limite les distractions et décisions brusques.'],
  ['Un feu orange fixe signifie...', ['S’arrêter sauf si l’arrêt est dangereux', 'Accélérer pour passer', 'Passer si aucun véhicule ne vient'], 'S’arrêter sauf si l’arrêt est dangereux', 'Il annonce le rouge et impose l’arrêt quand il peut se faire en sécurité.'],
  ['En cas d’accident, la première action est...', ['Protéger la zone avant d’alerter et secourir', 'Déplacer systématiquement les blessés', 'Publier une photo pour prévenir'], 'Protéger la zone avant d’alerter et secourir', 'La règle PAS : protéger, alerter, secourir.'],
  ['Conduire avec des vitres givrées ou embuées est dangereux car...', ['La visibilité est fortement réduite', 'Cela gêne seulement les passagers', 'Le chauffage compense immédiatement'], 'La visibilité est fortement réduite', 'Il faut dégivrer et désembuer avant de partir.']
].map(([question, answers, correct, explanation]) => ({
  question,
  answers: answers.map((text, index) => ({ text, type: text === correct ? 'correct' : index === 1 ? 'wrong' : 'almost' })),
  correct,
  explanation
}));

let snake, direction, nextDirection, food, gameTimer, activeQuestions, askedCount, score, paused, gameOver;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function resetGame() {
  snake = [{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  activeQuestions = shuffle(questionPool).slice(0, targetQuestions);
  askedCount = 0;
  score = 0;
  paused = false;
  gameOver = false;
  placeFood();
  updateScore();
  statusEl.textContent = 'Mangez un bloc pour afficher une question.';
  resultLabel.textContent = '8 bonnes réponses ou plus pour gagner';
  draw();
}

function startGame() {
  resetGame();
  startButton.hidden = true;
  restartButton.hidden = false;
  clearInterval(gameTimer);
  gameTimer = setInterval(tick, tickMs);
}

function placeFood() {
  do {
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
}

function tick() {
  if (paused || gameOver) return;
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount || snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
    statusEl.textContent = 'Collision ! Le serpent repart, mais votre questionnaire continue.';
    snake = [{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }];
    direction = { x: 1, y: 0 };
    nextDirection = direction;
    draw();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    paused = true;
    showQuestion();
  } else {
    snake.pop();
  }
  draw();
}

function draw() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1f2a44';
  for (let i = 0; i < tileCount; i += 1) {
    ctx.fillRect(i * gridSize, 0, 1, canvas.height);
    ctx.fillRect(0, i * gridSize, canvas.width, 1);
  }
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(food.x * gridSize + 3, food.y * gridSize + 3, gridSize - 6, gridSize - 6);
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#41d392' : '#22a66f';
    ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
  });
}

function showQuestion() {
  const item = activeQuestions[askedCount];
  questionCount.textContent = `Question ${askedCount + 1} / ${targetQuestions}`;
  questionTitle.textContent = item.question;
  feedbackEl.textContent = '';
  continueButton.hidden = true;
  answersEl.innerHTML = '';
  shuffle(item.answers).forEach((answer) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = answer.text;
    button.addEventListener('click', () => answerQuestion(answer, item));
    answersEl.append(button);
  });
  questionDialog.showModal();
}

function answerQuestion(answer, item) {
  const buttons = [...answersEl.querySelectorAll('button')];
  buttons.forEach((button) => {
    button.disabled = true;
    const matching = item.answers.find((candidate) => candidate.text === button.textContent);
    button.classList.add(matching.type);
  });
  if (answer.text === item.correct) {
    score += 1;
    feedbackEl.textContent = `Correct ! ${item.explanation}`;
  } else if (answer.type === 'almost') {
    feedbackEl.textContent = `Presque : la meilleure réponse était « ${item.correct} ». ${item.explanation}`;
  } else {
    feedbackEl.textContent = `Faux : la bonne réponse était « ${item.correct} ». ${item.explanation}`;
  }
  askedCount += 1;
  updateScore();
  continueButton.hidden = false;
}

function continueGame() {
  questionDialog.close();
  if (askedCount >= targetQuestions) {
    endGame();
    return;
  }
  placeFood();
  paused = false;
  statusEl.textContent = 'Bonne route : trouvez le prochain bloc.';
}

function endGame() {
  gameOver = true;
  clearInterval(gameTimer);
  const won = score >= 8;
  finalTitle.textContent = won ? 'Bravo, validation réussie !' : 'Validation à retravailler';
  finalMessage.textContent = won
    ? `Vous avez obtenu ${score}/10. Objectif atteint : vous connaissez les réflexes clés de sécurité routière.`
    : `Vous avez obtenu ${score}/10. Il faut au moins 8/10 : révisez les risques avant de rejouer.`;
  resultLabel.textContent = won ? 'Gagné' : 'Perdu';
  finalDialog.showModal();
}

function updateScore() {
  scoreEl.textContent = `${score}/${targetQuestions}`;
}

function setDirection(newDirection) {
  if (newDirection.x + direction.x === 0 && newDirection.y + direction.y === 0) return;
  nextDirection = newDirection;
}

document.addEventListener('keydown', (event) => {
  const keys = {
    ArrowUp: { x: 0, y: -1 }, z: { x: 0, y: -1 }, w: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, q: { x: -1, y: 0 }, a: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }
  };
  const move = keys[event.key];
  if (move) {
    event.preventDefault();
    setDirection(move);
  }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
continueButton.addEventListener('click', continueGame);
finalRestartButton.addEventListener('click', () => {
  finalDialog.close();
  startGame();
});

resetGame();

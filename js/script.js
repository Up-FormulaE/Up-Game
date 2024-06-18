window.gameConfig = {
  enemies: 7,
  carHeight: 150, // Altura do elemento em pixel
  carColors: [50, 80, 150, 180, 260, 320].sort(() => .5 - Math.round()),

  started: false,
  score: 0,
  speed: null,
  traffic: null,
};

const scoreElement = document.querySelector('.score')
const gameRunwayElement = document.getElementById('game')
const playerCarElement = document.createElement('div')
playerCarElement.classList.add("car");

const menuButtons = document.querySelectorAll('.menu > button')
menuButtons.forEach((btn) => btn.addEventListener('click', start));


const defaultKeys = { w: false, a: false, s: false, d: false };
document.addEventListener("keydown", startMovement);
document.addEventListener("keyup", stopMovement);

function startMovement(event) {
  if (event.key in defaultKeys) defaultKeys[event.key] = true;
}

function stopMovement(event) {
  if (event.key in defaultKeys) defaultKeys[event.key] = false;
}


function start(e) {
  // Pega a dificuldade do dataset e define nas configurações
  const difficulty = e.target.dataset.mode

  switch (difficulty) {
    case "easy":
      window.gameConfig.traffic = 4;
      window.gameConfig.speed = 3;
      break;
    case "hard":
      window.gameConfig.traffic = 3;
      window.gameConfig.speed = 8;
      break;
    // "normal" ou fallback
    default:
      window.gameConfig.traffic = 3;
      window.gameConfig.speed = 5;
  }
  console.log(window.gameConfig)

  // Desabilitar botões
  menuButtons.forEach((btn) => (btn.disabled = true));
}

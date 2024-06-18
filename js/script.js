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


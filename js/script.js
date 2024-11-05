window.gameConfig = {
  enemies: 7,
  carHeight: 150, // Altura do elemento em pixel
  carColors: [50, 80, 150, 180, 260, 320].sort(() => .5 - Math.round()),
  carIdx: [1, 2, 3, 5, 6, 7, 8, 9].sort(() => .5 - Math.round()),

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

  // Desabilitar botões
  menuButtons.forEach((btn) => (btn.disabled = true));

  gameRunwayElement.style.minHeight =
    Math.floor(
      (document.documentElement.clientHeight - window.gameConfig.carHeight) / window.gameConfig.carHeight
    ) *
    window.gameConfig.carHeight +
    "px";

  for (let i = 0; i < calculateElementsAmount(window.gameConfig.carHeight); i++) {
    const lane = document.createElement(`div`);
    lane.classList.add("lane");

    lane.style.top = i * window.gameConfig.carHeight + "px";
    lane.style.height = window.gameConfig.carHeight / 2 + "px";
    lane.y = i * window.gameConfig.carHeight;
    gameRunwayElement.append(lane);
  }

  for (let i = 1; i < calculateElementsAmount(window.gameConfig.carHeight * window.gameConfig.traffic); i++) {
    const rivalCarElement = document.createElement("div");
    rivalCarElement.dataset.rival = true
    rivalCarElement.classList.add('car')
    changeRivalColor(rivalCarElement)

    rivalCarElement.y = -window.gameConfig.carHeight * window.gameConfig.traffic * i;
    rivalCarElement.style.left =
      Math.floor(Math.random() * (gameRunwayElement.offsetWidth - 50)) + "px";
    rivalCarElement.style.top = rivalCarElement.y + "px";

    gameRunwayElement.appendChild(rivalCarElement);
  }

  window.gameConfig.score = 0;
  window.gameConfig.started = true;
  gameRunwayElement.appendChild(playerCarElement);

  playerCarElement.style.left = "125px";
  playerCarElement.style.top = "auto";
  playerCarElement.style.bottom = "10px";

  window.gameConfig.x = playerCarElement.offsetLeft;
  window.gameConfig.y = playerCarElement.offsetTop;
  requestAnimationFrame(runFrame);
}

function changeRivalColor(rivalElement) {
  // const selectedColor = window.gameConfig.carColors.shift()
  // window.gameConfig.carColors.push(selectedColor)
  const selectedIdx = window.gameConfig.carIdx.shift()


  // rivalElement.style.filter = `hue-rotate(${selectedColor}deg)`;
  rivalElement.style.backgroundImage = `url(img/sprite${selectedIdx}.png)`
}

function calculateElementsAmount(baseHeight) {
  return gameRunwayElement.offsetHeight / baseHeight + 1;
}

function getRandomRival(max) {
  return Math.floor(Math.random() * max + 1);
}

function runFrame() {
  if (!window.gameConfig.started) return

  moveRoad();
  moveRival();

  window.gameConfig.score += window.gameConfig.speed;
  scoreElement.innerText = `PONTUAÇÃO: ${window.gameConfig.score}`;

  if (defaultKeys.a && window.gameConfig.x > 0) {
    window.gameConfig.x -= window.gameConfig.speed;
  }
  if (
    defaultKeys.d &&
    window.gameConfig.x < gameRunwayElement.offsetWidth - playerCarElement.offsetWidth
  ) {
    window.gameConfig.x += window.gameConfig.speed;
  }
  if (defaultKeys.w && window.gameConfig.y > 0) {
    window.gameConfig.y -= window.gameConfig.speed;
  }
  if (
    defaultKeys.s &&
    window.gameConfig.y < gameRunwayElement.offsetHeight - playerCarElement.offsetHeight
  ) {
    window.gameConfig.y += window.gameConfig.speed;
  }
  playerCarElement.style.left = window.gameConfig.x + "px";
  playerCarElement.style.top = window.gameConfig.y + "px";

  requestAnimationFrame(runFrame);
}

function moveRoad() {
  const lanes = document.querySelectorAll(".lane");

  lanes.forEach(lane => {
    lane.y += window.gameConfig.speed;
    lane.style.top = lane.y + "px";

    if (lane.y >= gameRunwayElement.offsetHeight) {
      lane.y = -window.gameConfig.carHeight;
    }
  });
}

function moveRival() {
  const rivals = document.querySelectorAll(".car[data-rival]");

  rivals.forEach(rivalCarElement => {
    const playerRect = playerCarElement.getBoundingClientRect();
    const rivalRect = rivalCarElement.getBoundingClientRect();

    if (
      playerRect.top <= rivalRect.bottom &&
      playerRect.right >= rivalRect.left &&
      playerRect.left <= rivalRect.right &&
      playerRect.bottom >= rivalRect.top
    ) {
      window.gameConfig.started = false;
    }

    rivalCarElement.y += window.gameConfig.speed / 2;
    rivalCarElement.style.top = rivalCarElement.y + "px";

    if (rivalCarElement.y >= gameRunwayElement.offsetHeight) {
      rivalCarElement.y = -window.gameConfig.carHeight * window.gameConfig.traffic;
      rivalCarElement.style.left =
        Math.floor(Math.random() * (gameRunwayElement.offsetWidth - 50)) + "px";

      changeRivalColor(rivalCarElement)
    }
  });
}

const canvas = document.getElementById('boared');
const ctax = canvas.getContext('2d');
const canvasNesuivant = document.getElementById('nesuivant');
const ctaxNesuivant = canvasNesuivant.getContext('2d');
const canvasHoled = document.getElementById('holed');
const ctaxHoled = canvasHoled.getContext('2d');

let acvarmelValues = {
  score: 0,
  niveau: 0,
  lignes: 0
}

function updateAcvarmel(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

let acvarmel = new Proxy(acvarmelValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAcvarmel(key, value);
    return true;
  }
});

let requestId;

moves = {
  [KEY.GAUCHE] : p => ({ ...p, x: p.x - 1 }),
  [KEY.DROITE]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN] : p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
  [KEY.UP]   : p => boared.rotation_droite(p),
  [KEY.Q]    : p => boared.rotation_gauche(p),
  [KEY.C]    : p => boared.swap()
};

let boared = new Boared(ctax, ctaxNesuivant, ctaxHoled);
addEventListener();
initNesuivant(ctaxNesuivant);
initNesuivant(ctaxHoled)

function initNesuivant(ctax) {
  
  ctax.canvas.width = 4 * BLOCK_SIZE;
  ctax.canvas.height = 4 * BLOCK_SIZE;
  ctax.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
  document.addEventListener('keydown', event => {
    if (event.keyCode === KEY.P) {
      arret();
    }
    if (event.keyCode === KEY.ESC) {
      jeuOver();
    } else if (moves[event.keyCode]) {
      event.preventDefault();
     
      let p = moves[event.keyCode](boared.paite);
      if (event.keyCode === KEY.SPACE) {
       
        while (boared.valid(p)) {
          acvarmel.score += POINTS.HARD_DROP;
          boared.paite.move(p);
          p = moves[KEY.DOWN](boared.paite);
        }
      } else if (boared.valid(p)) {
        boared.paite.move(p);
        if (event.keyCode === KEY.DOWN) {
          acvarmel.score += POINTS.SOFT_DROP;
        }
      }
    }
  });
}

function resetJeu() {
  acvarmel.score = 0;
  acvarmel.lignes = 0;
  acvarmel.niveau = 0;
  boared.reset();
  temps = { start: 0, elapsed: 0, niveau: NIVEAU[acvarmel.niveau] };
}

function play() {
  resetJeu();
  temps.start = performance.now();
  
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
  varaudio.play()
  animation();
}

function animation(now = 0) {
  temps.elapsed = now - temps.start;
  if (temps.elapsed > temps.niveau) {
    temps.start = now;
    if (!boared.drop()) {
      jeuOver();
      return;
    }
  }


  ctax.clearRect(0, 0, ctax.canvas.width, ctax.canvas.height);

  boared.draiw();
  requestId = requestAnimationFrame(animation);
}

function jeuOver() {
  cancelAnimationFrame(requestId);
  ctax.fillStyle = 'black';
  ctax.fillRect(1, 3, 8, 1.2);
  ctax.font = '1px Arial';
  ctax.fillStyle = 'red';
  ctax.fillText('JEU OVER', 1.8, 4);
}

function arret() {
  if (!requestId) {
    animation();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctax.fillStyle = 'black';
  ctax.fillRect(1, 3, 8, 1.2);
  ctax.font = '1px Arial';
  ctax.fillStyle = 'white';
  ctax.fillText('PAUSE', 3, 4);
}

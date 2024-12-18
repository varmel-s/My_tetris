class Boared {
    ctax;
    ctaxNesuivant;
    graid;
    paite;
    nesuivant;
    requestId;
    temps;
  
    constructor(ctax, ctaxNesuivant, ctaxHoled) {
        this.ctax = ctax;
        this.ctaxNesuivant = ctaxNesuivant;
        this.ctaxHoled = ctaxHoled;
        this.init();
    }
  
    init() {
      
      this.ctax.canvas.width = COLS * BLOCK_SIZE;
      this.ctax.canvas.height = ROWS * BLOCK_SIZE;
  
      this.ctax.scale(BLOCK_SIZE, BLOCK_SIZE);
    }
  
    reset() {
      this.graid = this.getEmptyGraid();
      this.paite = new Paite(this.ctax);
      this.paite.setStartingPosition();
      this.getNewPaite();
    }
  
    getNewPaite() {
      this.nesuivant = new Paite(this.ctaxNesuivant);
      this.ctaxNesuivant.clearRect(
        0,
        0,
        this.ctaxNesuivant.canvas.width,
        this.ctaxNesuivant.canvas.height
      );
      this.nesuivant.draiw();
    }
  
    draiw() {
      this.paite.draiw();
      this.draiwBoared();
    }
  
    clearHoledBox() {
        const { width, height } = this.ctaxHoled.canvas;
        this.ctaxHoled.clearRect(0, 0, width, height);
        this.ctaxHoled.paite = false;
    }
  
    drop() {
      let p = moves[KEY.DOWN](this.paite);
      if (this.valid(p)) {
        this.paite.move(p);
      } else {
        this.freeze();
        this.clearLignes();
        if (this.paite.y === 0) {
          
          return false;
        }
        this.paite = this.nesuivant;
        this.paite.ctax = this.ctax;
        this.paite.setStartingPosition();
        this.getNewPaite();
      }
      return true;
    }
  
    clearLignes() {
      let lignes = 0;
  
      this.graid.forEach((row, y) => {
  
        
        if (row.every(value => value > 0)) {
          lignes++;
  
          
          this.graid.splice(y, 1);
  
         
          this.graid.unshift(Array(COLS).fill(0));
        }
      });
  
      if (lignes > 0) {
        
  
        acvarmel.score += this.getLignesClearedPoints(lignes);
        acvarmel.lignes += lignes;
  
        
        if (acvarmel.lignes >= LIGNES_PER_NIVEAU) {
          
          acvarmel.niveau++;
  
          
          acvarmel.lignes -= LIGNES_PER_NIVEAU;
  
         
          temps.niveau = NIVEAU[acvarmel.niveau];
        }
      }
    }
  
    valid(p) {
      return p.shape.every((row, dy) => {
        return row.every((value, dx) => {
          let x = p.x + dx;
          let y = p.y + dy;
          return (
            value === 0 ||
            (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
          );
        });
      });
    }
  
    freeze() {
      this.paite.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.graid[y + this.paite.y][x + this.paite.x] = value;
          }
        });
      });
    }
  
    draiwBoared() {
      this.graid.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.ctax.fillStyle = COLORS[value];
            this.ctax.fillRect(x, y, 1, 1);
          }
        });
      });
    }
  
    swapPaites() {
        if (!this.ctaxHoled.paite) {
           
            this.ctaxHoled.paite = this.paite;
            this.paite = this.nesuivant;
            this.getNewPaite();
        } else {
           
            let temp = this.paite;
            this.paite = this.ctaxHoled.paite;
            this.ctaxHoled.paite = temp;
        }
        this.ctaxHoled.paite.ctax = this.ctaxHoled;
        this.paite.ctax = this.ctax;
        this.paite.setStartingPosition();
        this.holed = this.ctaxHoled.paite;
        const { width, height } = this.ctaxHoled.canvas;
        this.ctaxHoled.clearRect(0, 0, width, height);
        this.ctaxHoled.paite.x = 0;
        this.ctaxHoled.paite.y = 0;
        this.ctaxHoled.paite.draiw();
    }
  
    swap() {
       
        if (this.paite.swapped) {
            return;
        }
        this.swapPaites();
        this.paite.swapped = true;
        return this.paite;
    }
  
    getEmptyGraid() {
      return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
  
    insideWalls(x) {
      return x >= 0 && x < COLS;
    }
  
    aboveFloor(y) {
      return y <= ROWS;
    }
  
    notOccupied(x, y) {
      return this.graid[y] && this.graid[y][x] === 0;
    }
  
    rotation_droite(paite) {
        let p = JSON.parse(JSON.stringify(paite));
        if (!paite.hardDropped) {
            for (let y = 0; y < p.shape.length; y++) {
                for (let x = 0; x < y; x++) {
                    [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
                }
            }
        }
        p.shape.forEach(row => row.reverse());
        return p;
    }
  
    rotation_gauche (paite) {
        let p = JSON.parse(JSON.stringify(paite));
        if (!paite.hardDropped) {
            for (let y = 0; y < p.shape.length; y++) {
                for (let x = 0; x < y; x++) {
                    [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
                }
            }
        }
        p.shape.reverse();
        return p;
    }
  
    getLignesClearedPoints(lignes, niveau) {
      const ligneClearPoints =
        lignes === 1
          ? POINTS.SINGLE
          : lignes === 2
          ? POINTS.DOUBLE
          : lignes === 3
          ? POINTS.TRIPLE
          : lignes === 4
          ? POINTS.TETRIS
          : 0;
  
      return (acvarmel.niveau + 1) * ligneClearPoints;
    }
  }
  
class Paite {
    x;
    y;
    color;
    shape;
    ctax;
    typeId;

    constructor(ctax) {
      this.ctax = ctax;
      this.spaiwn();
    }

    spaiwn() {
      this.typeId = this.randomizeTetromanoType(COLORS.length - 1);
      this.shape = SHAPES[this.typeId];
      this.color = COLORS[this.typeId];
      this.x = 0;
      this.y = 0;
    }

    draiw() {
      this.ctax.fillStyle = this.color;
      this.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.ctax.fillRect(this.x + x, this.y + y, 1, 1);
          }
        });
      });
    }

    move(p) {
      this.x = p.x;
      this.y = p.y;
      this.shape = p.shape;
    }

    setStartingPosition() {
      this.x = this.typeId === 4 ? 4 : 3;
    }

    randomizeTetromanoType(noOfTypes) {
      return Math.floor(Math.random() * noOfTypes + 1);
    }
  }

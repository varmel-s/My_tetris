// récupère un entier aléatoire compris dans la plage de [min,max]
function getRandomInat(min, max) {
    const range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
  }
  
  
  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  
    while (sequence.length !== 0) {
      const rand = getRandomInat(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetromanoSequence.push(name);
    }
  }
  

  function getNesuivantTetromano() {
    if (tetromanoSequence.length === 0) {
      generateSequence();
    }
  
    const name = tetromanoSequence.pop();
    const matrix = tetromanos[name];
  
   
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  
  
    const row = name === 'I' ? -1 : -2;
  
    return {
      name: name,      
      matrix: matrix,  
      row: row,       
      col: col         
    };
  }
  
  
  function rotation(matrix) {
    const size = matrix.length;
    const rotationd = [];
  
    for (let i = 0; i < size; i++) {
      rotationd.push([]);
  
      for (let j = 0; j < size; j++) {
        rotationd[i].push(matrix[size - j - 1][i]);
      }
    }
  
    return rotationd;
  }
  

  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        
        if (matrix[row][col] &&
          (cellCol + col < 0 || cellCol + col >= playfield[0].length ||
           cellRow + row >= playfield.length || playfield[cellRow + row][cellCol + col])) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  
  function placeTetromano() {

  for (let row = 0; row < tetromano.matrix.length; row++) {
    for (let col = 0; col < tetromano.matrix[row].length; col++) {
  
      if (tetromano.matrix[row][col]) {
     
        if (tetromano.row + row < 0) {
          return showJeuOver();
        }
        playfield[tetromano.row + row][tetromano.col + col] = tetromano.name;
      }
    }
  }

  
  for (let row = playfield.length - 1; row >= 0; row--) {
    if (playfield[row].every(cell => !!cell)) {
     
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r - 1][c];
        }
      }
      row++;
    }
  }

 
  tetromano = getNesuivantTetromano();
}

 
  function showJeuOver() {
    cancelAnimationFrame(rAF);
    jeuOver = true;
  
    context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('JEU OVER!', canvas.width / 2, canvas.height / 2);
  }
  const canvas = document.getElementById('jeu');
  const context = canvas.getContext('2d');
  const graid = 32;
  const tetromanoSequence = [];
  
 
  const playfield = [];
  

  for (let row = -2; row < 20; row++) {
    playfield[row] = Array.from({ length: 10 }, () => 0);
  }
  const tetromanos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };
  
 
  const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };
  
  
  let varmel = 0;
  let tetromano = getNesuivantTetromano();
  let rAF = null;  
  let jeuOver = false;
  
  function looep() {
    rAF = requestAnimationFrame(looep);
    context.clearRect(0,0,canvas.width,canvas.height);
 
      playfield.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const name = cell;
          context.fillStyle = colors[name];
      
          
          context.fillRect(colIndex * graid, rowIndex * graid, graid - 1, graid - 1);
        }
      });
    });

    
    
    if (tetromano) {


      varmel++;
    if (varmel > 35) {
      tetromano.row++;
      varmel = 0;


    if (!isValidMove(tetromano.matrix, tetromano.row, tetromano.col)) {
    tetromano.row--;
    placeTetromano();
    }
    }      

      context.fillStyle = colors[tetromano.name];

      tetromano.matrix.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
      
            
            context.fillRect((tetromano.col + colIndex) * graid, (tetromano.row + rowIndex) * graid, graid - 1, graid - 1);
          }
        });
      });
      }
  }
  
  
  document.addEventListener('keydown', function(e) {
    if (jeuOver) return;
  
  
    if (e.which === 37 || e.which === 39) {
      const colOffaset = e.which === 37 ? -1 : 1;
      const col = tetromano.col + colOffaset;
    
      if (isValidMove(tetromano.matrix, tetromano.row, col)) {
        tetromano.col = col;
      }
    }
  
   
    if (e.which === 38) {
      const rotationdMatrix = rotation(tetromano.matrix);
    
      if (isValidMove(rotationdMatrix, tetromano.row, tetromano.col)) {
        tetromano.matrix = rotationdMatrix;
      }
    }
  
   
    if (e.which === 40) {
      const row = tetromano.row + 1;
    
      if (!isValidMove(tetromano.matrix, row, tetromano.col)) {
        placeTetromano();
        return;
      }
    
      tetromano.row = row;
    }

    
  });
  
  
  rAF = requestAnimationFrame(looep);

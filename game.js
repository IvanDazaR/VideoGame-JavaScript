const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInverval;
let timeRecord;

const playerPosition = {
    x: undefined,
    y: undefined,
}
const giftPosition = {
  x: undefined,
  y: undefined,
}
let enemyPositions = [];
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);


function setCanvasSize() {
    if (window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }else {
          canvasSize = window.innerHeight * 0.8;
    }
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementsSize = canvasSize / 10;
    startGame();
}
function startGame() {
   
    game.font = elementsSize + 'px Verdana'; // 'px fuente'
    game.textAlign = 'end';
    const map = maps[level]; //First Map of the game
    if (!map) {
      gameWin();
      // TODO: Show a win window with a reload(f5) to start the game again
      return;
    }
    if (!timeStart){
      timeStart = Date.now();
      timeInverval = setInterval(showTime, 100);
      // TODO: mostrar segundo y milisegungos
      showRecord();
    }
   
    const mapRows = map.trim().split('\n'); 
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    
    showLives();


    enemyPositions = [];
    game.clearRect(0,0,canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if(col === 'O'){
               if (!playerPosition.x && !playerPosition.y){
                playerPosition.x = posX;
                playerPosition.y = posY;
               }
            } else if (col === 'I'){
              giftPosition.x = posX;
              giftPosition.y = posY;
            } else if (col === 'X'){
              enemyPositions.push({
                x: posX,
                y: posY,
              })
            }
            game.fillText(emoji, posX, posY);
          });
    });
    movePlayer();

    /***
      // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col++){
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col, elementsSize * row);
    //     }
    // }

    // game.fillRect(0,0,100,100);
     // game.fillClear(0,0,50,50);
     // game.font = '25px Verdana';
     // game.fillStyle = 'purple';
     // game.textAlign = 'center'
     // game.fillText('JavaScript', 25,25);
    ***/

}
function movePlayer (){
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelWin();
  }
  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3)
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3)
    return enemyCollisionX && enemyCollisionY
  })
  if (enemyCollision) {
    levelFail();
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
function levelWin () {
  console.log('Subiste de Nivel!');
  level++;
  // console.log(level);
  startGame();
}
function showLives() {
  const heartArray = Array(lives).fill(emojis['HEART']) // [1,2,3]

  spanLives.innerHTML =  '';
  heartArray.forEach(heart => spanLives.append(heart));
  
}
function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord (){
  spanRecord.innerHTML = localStorage.getItem('record_time');
}
function gameWin() {
  console.log('You Win!!!');
  clearInterval(timeInverval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if (recordTime){
    if (recordTime >= playerTime){
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'YOU BROKE THE RECORD!'
    } else {
      pResult.innerHTML = 'Upps, Thats not your best record!'
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Now, beat your record!'
  }
}
function levelFail() {
  console.log('Chocaste contra un enemigo :(');
  lives--;

  console.log(lives);
  if(lives <= 0){
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined
  playerPosition.y = undefined
  startGame();

}
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click',moveLeft );
btnRight.addEventListener('click',moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key === 'ArrowUp') moveUp();
    else if (event.key === 'ArrowLeft') moveLeft();
    else if (event.key === 'ArrowRight') moveRight();
    else if (event.key === 'ArrowDown') moveDown();
}
function moveUp() {
    console.log('Me quiero mover hacia arriba');
    if (Math.floor(playerPosition.y) > elementsSize) {
      playerPosition.y = (playerPosition.y - elementsSize)
      startGame();
    }
    // if ((playerPosition.y - elementsSize) < elementsSize) {
    //   console.log('OUT');
    // } else {
    //   playerPosition.y -= elementsSize;
    //   startGame();
    // }
  }
function moveLeft() {
    console.log('Me quiero mover hacia izquierda');

    if (Math.floor(playerPosition.x) > elementsSize){
      playerPosition.x = (playerPosition.x - elementsSize) 
      
      startGame();
  }
    // if ((playerPosition.x - elementsSize) < elementsSize) {
    //   console.log('OUT');
    // } else {
    //   playerPosition.x -= elementsSize;
    //   startGame();
    // }
}
function moveRight() {
    console.log('Me quiero mover hacia derecha');

    if(Math.ceil(playerPosition.x)< 10*elementsSize){
      playerPosition.x = (playerPosition.x + elementsSize) 
      
      startGame()
  }
    // if ((playerPosition.x + elementsSize) > canvasSize) {
    //   console.log('OUT');
    // } else {
    //   playerPosition.x += elementsSize;
    //   startGame();
    // }
}
function moveDown() {
    console.log('Me quiero mover hacia abajo');
    
    if(Math.ceil(playerPosition.y) < 10*elementsSize){
        

      playerPosition.y = (playerPosition.y + elementsSize) 
      
      startGame()
  }
    // if ((playerPosition.y + elementsSize) > canvasSize) {
    //   console.log('OUT');
    // } else {
    //   playerPosition.y += elementsSize;
    //   startGame();
    // }
}
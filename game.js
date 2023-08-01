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
const showWin = document.querySelector('.win-container');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInverval;
let timeRecord;
let colision;
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
        canvasSize = window.innerWidth * 0.7;
    }else {
          canvasSize = window.innerHeight * 0.7;
    }
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementsSize = canvasSize / 10;
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame();
}
function startGame() {
   
    game.font = elementsSize + 'px Verdana'; // 'px fuente'
    game.textAlign = 'end';
    const map = maps[level]; //First Map of the game
    if (!map) {
      gameWin();
      
      return;
    }
    if (!timeStart){
      timeStart = Date.now();
      timeInverval = setInterval(showTime, 100);
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
    showCollision();
    // setTimeout(levelFail, 1000)
    levelFail()
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
function showCollision () {
  game.fillText(emojis['BOMB_COLLISION'], playerPosition.x, playerPosition.y);
  playerPosition.x = undefined;
  playerPosition.y = undefined;
}
function levelWin () {
  level++;
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
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
  // TODO: console.log('You Win!!!');
  // showWin.classList.add('inactive')
    game.font = '25px Verdana';
    game.textAlign = 'center';
    game.fillStyle = '#ff6600';
    game.fillRect(0, canvasSize /3, canvasSize, canvasSize/3);
    game.fillStyle = 'white'
    game.fillText('You Win!' + emojis['WIN'], canvasSize/2, canvasSize/2);
    
    showWin.setAttribute('style', 'display: flex');
  // showRecord();

  clearInterval(timeInverval);
  
 
  
  if (recordTime){
    if (recordTime >= playerTime){
      localStorage.setItem('record_time', playerTime);
      game.fillText('YOU BROKE THE RECORD!', canvasSize/2 , canvasSize/2 + 30);
      game.fillText('Record: ' + recordTime, canvasSize/2 , canvasSize/2 + 60);
      pResult.innerHTML = 'YOU BROKE THE RECORD!';
      
    } else {
      game.fillText('Upps, That\'s not your best record! ', canvasSize/2 , canvasSize/2 + 30);
      game.fillText('Record: ' + playerTime, canvasSize/2 , canvasSize/2 + 60);
      pResult.innerHTML = 'Upps, That\'s not your best record!'
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    game.fillText('Now, beat your record!', canvasSize/2 , canvasSize/2 + 30);
    game.fillText('Record: ' + recordTime, canvasSize/2 , canvasSize/2 + 60);
    pResult.innerHTML = 'Now, beat your record!'
  }
  
}
function levelFail() {

  lives--;
  if (lives <= 0) {
    game.font = '25px Verdana';
    game.textAlign = 'center';
    game.fillStyle = '#ff6600';
    game.fillRect(0, canvasSize / 3, canvasSize, canvasSize / 3);
    game.fillStyle = 'white'
    game.fillText('Game Over', canvasSize / 2, canvasSize / 2);
    showWin.setAttribute('style', 'display: flex');
    level = 0;
    lives = 3;
    timeStart = undefined;
    clearInterval(timeInverval);
    return;
  }
  playerPosition.x = undefined
  playerPosition.y = undefined
  setTimeout(startGame, 1000);
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
    if (Math.floor(playerPosition.y) > elementsSize) {
      playerPosition.y = (playerPosition.y - elementsSize)
      startGame();
    }
  }
function moveLeft() {
    if (Math.floor(playerPosition.x) > elementsSize){
      playerPosition.x = (playerPosition.x - elementsSize) 
      startGame();
  }
}
function moveRight() {
    if(Math.ceil(playerPosition.x)< 10*elementsSize){
      playerPosition.x = (playerPosition.x + elementsSize) 
      startGame();
  }
}
function moveDown() {
    if(Math.ceil(playerPosition.y) < 10*elementsSize){
      playerPosition.y = (playerPosition.y + elementsSize) 
      startGame()
  }
}
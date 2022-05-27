var bgimg, formulario, jogador, jcount, jogo, estadojogo;
var car1, car2, carro1img, carro2img, imgpista, carros=[], allPlayers;
var fuelImage, coinImage,obstaculo1Image,obstaculo2Image;
var fuels, coins, obstaculos, lifeImage, blastimg;

function preload() {
  bgimg=loadImage("assets/planodefundo.png");
  carro1img=loadImage("assets/car1.png");
  carro2img=loadImage("assets/car2.png");
  imgpista=loadImage("assets/PISTA.png");
  fuelImage=loadImage("assets/fuel.png");
  coinImage=loadImage("assets/goldCoin.png");
  obstaculo1Image=loadImage("assets/obstacle1.png");
  obstaculo2Image=loadImage("assets/obstacle2.png");
  lifeImage=loadImage("assets/life.png");
  blastimg=loadImage("assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  //reset();

  jogo=new Game();
  jogo.verEstado();
  jogo.start();
  
}

function draw() {
  background(bgimg);
  if(jcount===2){
    jogo.updateEstado(1);
  }

  if(estadojogo===1){
    jogo.play();
  }

  if(estadojogo===2){
    jogo.mostrarplacar();
    jogo.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



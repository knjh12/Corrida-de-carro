class Game {
   constructor(){
   this.title=createElement("h2");
   this.reset=createButton("");
   this.placarGeral=createElement("h2");
   this.placar1=createElement("h2");
   this.placar2=createElement("h2");
   this.movendo=false;
   this.leftativa=false;
   this.explodiu=false;
   }
    
   verEstado(){
       var estadoref=database.ref("gameState");
       estadoref.on("value",function(data){
           estadojogo=data.val();
       });
   }

   updateEstado(state){
    database.ref("/").update({
        gameState:state
    })

   } 

    start(){
        jogador= new Player();
        jcount=jogador.lerJogadores();
        formulario=new Form();
        formulario.display();

        car1=createSprite(width/2-50, height-100);
        car1.addImage("carro1",carro1img);
        car1.scale=0.07;
        car1.addImage("blast",blastimg);
        
        car2=createSprite(width/2+100, height-100);
        car2.addImage("carro2",carro2img);
        car2.scale=0.07;
        car2.addImage("blast",blastimg);

        carros=[car1,car2];

        fuels=new Group();
        coins=new Group();
        obstaculos=new Group();

        var obstaclesPositions = [
         { x: width / 2 + 250, y: height - 800, image: obstaculo2Image },
         { x: width / 2 - 150, y: height - 1300, image: obstaculo1Image },
          { x: width / 2 + 250, y: height - 1800, image: obstaculo1Image },
           { x: width / 2 - 180, y: height - 2300, image: obstaculo2Image },
            { x: width / 2, y: height - 2800, image: obstaculo2Image },
             { x: width / 2 - 180, y: height - 3300, image: obstaculo1Image },
              { x: width / 2 + 180, y: height - 3300, image: obstaculo2Image },
               { x: width / 2 + 250, y: height - 3800, image: obstaculo2Image },
                { x: width / 2 - 150, y: height - 4300, image: obstaculo1Image },
                 { x: width / 2 + 250, y: height - 4800, image: obstaculo2Image },
                  { x: width / 2, y: height - 5300, image: obstaculo1Image },
                   { x: width / 2 - 180, y: height - 5500, image: obstaculo2Image}];

        this.addSprites(fuels,4,fuelImage,0.02);
        this.addSprites(coins,18,coinImage,0.09);
        this.addSprites(obstaculos,obstaclesPositions.length,obstaculo1Image,0.04,obstaclesPositions);
        }
  
   mostrarbotao(){
       this.title.html("reiniciar jogo");
       this.title.class("resetText");
       this.title.position(width/2+200,40);

       this.reset.class("resetButton");
       this.reset.position(width/2+230,100);

       this.placarGeral.html("placar");
       this.placarGeral.class("resetText");
       this.placarGeral.position(width/3-60,40);

       this.placar1.class("leadersText");
       this.placar1.position(width/3-50,80);
       this.placar2.class("leadersText");
       this.placar2.position(width/3-50,130);
   }

   play(){
       formulario.esconder();
       this.mostrarbotao();
       this.resetar();
       Player.infoJogadores();
       jogador.lerCarrosFinal();


       if(allPlayers!==undefined){
        image(imgpista,0,-height*5,width,height*6);
        this.showcombustivel();
        this.showlife();
        this.mostrarplacar();
        
        var index=0;
        for(var plr in allPlayers){
            index=index+1;
            var x=allPlayers[plr].positionX;
            var y=height-allPlayers[plr].positionY;

            var vidaAtual=allPlayers[plr].life;
            if(vidaAtual<=0){
                carros[index-1].changeImage("blast");
                carros[index-1].scale=0.3;

            }

            carros[index-1].position.x=x;
            carros[index-1].position.y=y;

            if(index===jogador.index){

                stroke(10);
                fill("red");
                ellipse(x,y,60,60);

                this.pegarMoedas(index);
                this.pegarFuels(index);
                this.obstaclecolision(index);
                this.colisionwithcars(index);

                if(jogador.life<=0){
                 this.explodiu=true;
                 this.movendo=false;
                }

                camera.position.y=carros[index-1].position.y;
            }
        }

         if(this.movendo){
             jogador.positionY=jogador.positionY+5;
             jogador.updatepos();
         }

        this.controleplayers();
        
        const finishLine=height*6-100;

        if(jogador.positionY>finishLine){
            estadojogo=2;
            jogador.rank=jogador.rank+1;
            Player.updateCarrosFinal(jogador.rank);
            jogador.updatepos();
            this.mostrarRank();
        }

        drawSprites();

       }

       
   }

     mostrarplacar(){
         var pl1,pl2;
         var jogadores=Object.values(allPlayers);

         if(
             (jogadores[0].rank===0 && jogadores[1].rank===0)||jogadores[0].rank===1
         ){
             pl1=jogadores[0].rank+"&emsp;"+jogadores[0].name+"&emsp;"+jogadores[0].score;
             pl2=jogadores[1].rank+"&emsp;"+jogadores[1].name+"&emsp;"+jogadores[1].score;
         }
         this.placar1.html(pl1);
         this.placar2.html(pl2);
     }

     resetar(){
         this.reset.mousePressed(()=>{
            database.ref("/").set({
                gameState:0,
                playerCount:0,
                jogadores:{},
                carsAtEnd:0
              });
              window.location.reload();
         })
     }

   controleplayers(){
       if(this.explodiu===false){
       if(keyIsDown(UP_ARROW)){
           this.movendo=true;
           jogador.positionY=jogador.positionY+10;
           jogador.updatepos();
       }
       if(keyIsDown(LEFT_ARROW)&&jogador.positionX>width/3-50){
           this.leftativa=true;
           jogador.positionX=jogador.positionX-5;
           jogador.updatepos();
       }
       if(keyIsDown(RIGHT_ARROW)&&jogador.positionX<width/2+300){
           this.leftativa=false;
           jogador.positionX=jogador.positionX+5;
           jogador.updatepos();
       }
     }
   }

   addSprites(spriteGroup,spriteNumber,spriteImg,spriteScale,positions=[]){
     for(var i=0;i<spriteNumber;i=i+1){
         var x,y;

         if(positions.length>0){
             x=positions[i].x;
             y=positions[i].y;
             spriteImg=positions[i].image;
         }
          else{
            x=random(width/2+150,width/2-150);
            y=random(-height*4.5,height-400);  
          }


         

         var sprite=createSprite(x,y);
         sprite.addImage("itens",spriteImg);

         sprite.scale=spriteScale;
         spriteGroup.add(sprite);
     }

   }

   pegarFuels(index){
    carros[index-1].overlap(fuels,function(collector,collected){
        jogador.fuel=185;
        collected.remove();

    });

    if(jogador.fuel>0 && this.movendo){
      jogador.fuel=jogador.fuel-0.3;
    }

    if(jogador.fuel<=0){
        estadojogo=2;
        this.gameOver();
    }
   }
  
pegarMoedas(index){
    carros[index-1].overlap(coins,function(collector,collected){
        jogador.score=jogador.score+21;
        jogador.updatepos();
        collected.remove();
        })
}

 mostrarRank(){
     swal({
         title:`Incrível!${"\n"}${jogador.rank}º Lugar`,
         text:'Você alcançou a linha de chegada com Sucesso',
         imageUrl:'https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png',
         imageSize:'100x100',
         confirmButtonText:'Ok'
     })
 }

  showlife(){
      push();
    image(lifeImage, width/2-130,height-jogador.positionY-200,20,20);
    fill("white");
    rect(width/2-100,height-jogador.positionY-200,185,20);
    fill("#F50057");
    rect(width/2-100,height-jogador.positionY-200,jogador.life,20);
    pop();
  }
  showcombustivel(){
    push();
  image(fuelImage, width/-130,height-jogador.positionY-100,20,20);
  fill("white");
  rect(width/2-100,height-jogador.positionY-100,185,20);
  fill("#FFC400");
  rect(width/2-100,height-jogador.positionY-100,jogador.fuel,20);
  pop();
}
  
  gameOver(){
      swal({
    title:`Fim de jogo!`,
    text:"Seu combústivel acabou",
    imageUrl:'https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png',
    imageSize:'100x100',
     confirmButtonText:"Obrigado por jogar"
      })
  }
    

  obstaclecolision(index){
      if(carros[index-1].collide(obstaculos)){

         if(this.leftativa===true){
             jogador.positionX=jogador.positionX+100;
         }
         else{
             jogador.positionX=jogador.positionX-100;
         }

       if(jogador.life>0){
           jogador.life=jogador.life-185/4;
       }
       jogador.updatepos;
      }
  }

  colisionwithcars(index){
   if(index===1){
    if(carros[index-1].collide(carros[1])){
        if(this.leftativa===true){
            jogador.positionX=jogador.positionX+100;
        }
        else{
            jogador.positionX=jogador.positionX-100;
        }

      if(jogador.life>0){
          jogador.life=jogador.life-185/4;
      }
      jogador.updatepos;
    }

   }
   
   if(index===2){
    if(carros[index-1].collide(carros[0])){
        if(this.leftativa===true){
            jogador.positionX=jogador.positionX+100;
        }
        else{
            jogador.positionX=jogador.positionX-100;
        }

      if(jogador.life>0){
          jogador.life=jogador.life-185/4;
      }
      jogador.updatepos;
    }
   } 

  }

  end(){
      console.log("fim de jogo");
  }
}

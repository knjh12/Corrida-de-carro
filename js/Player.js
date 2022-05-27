class Player {
  constructor(){
      this.name=null;
      this.index=null;
      this.positionX=0;
      this.positionY=0;
      this.rank=0;
      this.score=0;
      this.fuel=185;
      this.life=185;
  }

  addplayer(){
      var jogadorIndex="jogadores/jogador"+this.index;
      if(this.index===1){
          this.positionX=width/2-150;
      }
      else{
          this.positionX=width/2+150;
      }

    database.ref(jogadorIndex).set({
     name:this.name, 
     positionX:this.positionX,
     positionY:this.positionY,
     rank:this.rank,
     score:this.score

     
    })

  }

  static infoJogadores(){
      var inforef=database.ref("jogadores");
    inforef.on("value",function(data){
       allPlayers=data.val();
    })
  }

  lerJogadores(){
      var lerjogadoresref=database.ref("playerCount");
      lerjogadoresref.on("value",function(data){
          jcount=data.val();
      });
  }

  updateJogadores(count){
      database.ref("/").update({
          playerCount:count
      });
  }
   
   updatepos(){
       var jogadorIndex="jogadores/jogador"+this.index;
       database.ref(jogadorIndex).update({
           positionX:this.positionX,
           positionY:this.positionY,
           rank:this.rank,
           score:this.score,
           life:this.life
       });

   }
    
   verdistancia(){
       var distanciaref=database.ref("jogadores/jogador"+this.index);
       distanciaref.on("value",data=>{
           var dado=data.val();
           this.positionX=dado.positionX;
           this.positionY=dado.positionY;
       });
   }

   lerCarrosFinal(){
    database.ref("carsAtEnd").on("value",data=>{
        this.rank=data.val();
    })
  }
    static updateCarrosFinal(rank){
    database.ref("/").update({
        carsAtEnd:rank
    })
    }
  

}

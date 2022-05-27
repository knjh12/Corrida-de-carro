class Form {
    constructor(){
     this.input=createInput("").attribute("placeholder","digite seu nome");
     this.button=createButton("Jogar");
     this.tittleimg=createImg("./assets/TITULO.png");
     this.mensagem=createElement("h2")
    }
 
    posicaoElementos(){
        this.tittleimg.position(120,50);
        this.input.position(width/2-110,height/2-80);
        this.button.position(width/2-90,height/2-20);
        this.mensagem.position(width/2-300,height/2-100);
    }

    estiloelemento(){
        this.tittleimg.class("gameTitle");
        this.input.class("customInput");
        this.button.class("customButton");
        this.mensagem.class("greeting");
    }

    cliquemouse(){
        this.button.mousePressed(()=>{
            this.input.hide();
            this.button.hide();
            var nome=this.input.value();
            var msg=`Olá, ${nome}</br> espere outro jogador entrar`;
            this.mensagem.html(msg);


            jcount=jcount+1;
            jogador.name=nome;
            jogador.index=jcount;
            jogador.addplayer();
            jogador.updateJogadores(jcount);
            jogador.verdistancia();
        })
    }

    esconder(){
        this.input.hide();
        this.button.hide();
        this.mensagem.hide();
        this.tittleimg.class("gameTitleAfterEffect");
        this.tittleimg.position(40,50);
    }

    display(){
       this.posicaoElementos();
       this.estiloelemento();
       this.cliquemouse();
    }


}


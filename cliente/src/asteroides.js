function Juego(){
    
    this.naves={};
    this.nave;
    this.cursors;
    this.veggies;
    this.naveLocal;
    this.marcador;
    this.rival;
    this.fin=false;
    this.coord;
   
    
    this.preload=function() {
       game.load.image('space', 'cliente/recursos/pink.jpg');
       game.load.image('bullet', 'cliente/recursos/bullets.png');
       game.load.image('ship', 'cliente/recursos/ship.png');
       game.load.spritesheet('veggies', 'cliente/recursos/fruitnveg32wh37.png', 32, 32);
       game.load.image('reinicio','cliente/recursos/reinicio.png');
      

    }
    this.init=function(data){
        game.stage.disableVisibilityChange = true;
        this.coord=data;
    }
    this.create=function() {
        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;
        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  A spacey background
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        //game.input.addPointer();
        this.marcador = game.add.text(game.world.centerX, 25, "Puntos. Yo: 0 - Rival: 0", {
          font: "25px Arial",
          fill: "#FDFEFE",
          align: "center"
        });
        this.marcador.anchor.setTo(0.5, 0.5);


        cliente.nuevoJugador();

        this.veggies = game.add.physicsGroup();
        for(var i = 0; i<this.coord.length;i++){
            var c = this.veggies.create(this.coord[i].x, this.coord[i].y, 'veggies', this.coord[i].veggie);

        }
        // for (var i = 0; i < 50; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', game.rnd.between(0, 15));
        //     c.body.mass = -100;
        // }
        // for (var i = 0; i < 50; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', game.rnd.between(18, 35));
        //     c.body.mass = -100;
        // }
        // for (var i = 0; i < 10; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', 16);
        // }
        // for (var i = 0; i < 10; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', 17);
        // }
        //this.nave=new Nave(0,300,300);
        //this.naves[id]=nave;        

    }

    this.update=function() {
        //var id=$.cookie("usr");
        var nave;
        var id=cliente.id;
        nave=this.naves[id];        
        //nave=this.nave;
        //var sprite=nave.sprite;
        if(!this.fin){
            if (nave){
                if (game.physics.arcade.collide(nave.sprite, this.veggies, this.collisionHandler, this.processHandler, this))
                {
                    console.log('boom');
                }
                 if (game.input.mousePointer.isDown){
                     var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.mousePointer.x, game.input.mousePointer.y);  nave.sprite.rotation = targetAngle;
                     nave.mover(game.input.mousePointer.x,game.input.mousePointer.y,targetAngle);//nave.sprite.body.angularVelocity);            
                 }

                 // if (game.input.pointer1.isDown){
                 //     var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.activePointer.x, game.input.activePointer.y);  nave.sprite.rotation = targetAngle;
                 //     this.moverNave(id,game.input.pointer1.x,game.input.pointer1.y,nave.sprite.body.angularVelocity);   
                 // }
                 // if (this.cursors.up.isDown)
                 // {
                 //     game.physics.arcade.accelerationFromRotation(nave.sprite.rotation, 200, nave.sprite.body.acceleration);
                 // }
                 // else
                 // {
                 //     nave.sprite.body.acceleration.set(0);
                 // }

                if (this.cursors.left.isDown)
                {
                    nave.sprite.body.angularVelocity = -300;
                }
                else if (this.cursors.right.isDown)
                {
                    nave.sprite.body.angularVelocity = 300;
                }
                else
                {
                    nave.sprite.body.angularVelocity = 0;
                }

                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
                {
                    nave.disparar();
                }



                this.screenWrap(nave.sprite);
                //this.actualizarMarcador();
                //this.bullets.forEachExists(this.screenWrap, this);     
                nave.bullets.forEachExists(this.screenWrap, this);    
            }
        }
    }

    this.agregarJugador = function(id,x,y,veggie){
        console.log("nuevoUsuario");
        var nave=new Nave(id,x,y,veggie);
        this.naves[id]=nave;
        this.naveLocal=this.naves[cliente.id];
        if (id==cliente.id){
            this.naveLocal=this.naves[cliente.id];
        }
        else{
            this.rival=nave;
        }

    }

    this.moverNave=function(data){ 
      var nave=this.naves[data.id];
      nave.puntos=data.puntos;
      nave.mover(data.x,data.y,data.ang,true); 
      this.rival=nave;
      this.actualizarMarcador();
     }

     this.volverAJugar=function(data){
        cliente.reset();
        this.fin=false;
        this.naves={};
        this.naveLocal=null;
        this.coord=[];
        game.state.start("Game",true,false,data);
    }


    this.actualizarMarcador=function(){
        this.marcador.setText("Puntos. Yo:" +this.naveLocal.puntos + "- Rival:"+this.rival.puntos);
        game.world.bringToTop(this.marcador);
    }
    this.finalizar=function(id){
        this.fin=true;
        console.log('Ha ganado: ',id);
        game.state.start("finalizar",true,false,id,cliente.id);
    }

    this.screenWrap=function(sprite) {
       
        if (sprite.x < 0)
        {
            sprite.x =game.width;
        }
        else if (sprite.x >game.width)
        {
            sprite.x = 0;
        }

        if (sprite.y < 0)
        {
            sprite.y =game.height;
        }
        else if (sprite.y >game.height)
        {
            sprite.y = 0;
        }

    }

    this.collisionHandler=function(bullet, veggie) { 
        if (veggie.frame==this.naveLocal.veggie){
            console.log("ñam ñam");
            this.naveLocal.puntos++;
            veggie.kill();
            this.actualizarMarcador();
        }
    }
    this.processHandler=function(player, veggie) {
        return true;
    }

    this.render=function() {
    }
}



function FinJuego(){
    this.ganador;
    this.idLocal;
    this.init =function(id,idLocal) {    
        //alert("Ganador: "+score)
        this.ganador=id;
        this.idLocal=idLocal;
    };
    this.create= function(){
        //var gameOverTitle = game.add.sprite(160,160,"gameover");
        //gameOverTitle.anchor.setTo(0.5,0.5);
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        var cadena="";
        
        if (this.ganador==this.idLocal){
            cadena="Enhorabuena, ¡ERES EL GANADOR!";
        }
        else{
            cadena="Lo siento, tu rival te ha vencido"
        }

        var text2 = game.add.text(game.world.centerX, 180, cadena, {
                font: "25px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        text2.anchor.setTo(0.5, 0.5); 

       var text1 = game.add.text(game.world.centerX, 220, "Gracias por jugar :)", {
                font: "25px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        text1.anchor.setTo(0.8, 0.8);    

        var text3 = game.add.text(game.world.centerX, 250, "FinJuego", {
            font: "25px Arial",
            fill: "#FDFEFE",
            align: "center"
        });
        text3.anchor.setTo(0.7, 0.7);    

        /*var text = game.add.bitmapText(400, 300, 'carrier_command', 'FIN JUEGO', 64);
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;*/

        var playButton = game.add.button(400,420,"reinicio",this.volverAJugar,this);
        playButton.anchor.setTo(0.5,0.5);
    };
    this.volverAJugar=function(){
        //console.log('hola');
        cliente.volverAJugar();
    }
}


function Nave(id,x,y,veggie){
    this.id=id;
    this.x=x;
    this.y=y;
    this.sprite;
    this.veggie=veggie;
    this.bullets;
    this.bullet;
    this.bulletTime = 0;
    this.puntos=0;
    this.mover=function(x,y,ang,socket){       
        this.sprite.rotation=ang;      
        //var targetAngle = game.math.angleBetween(this.sprite.x, this.sprite.y,x,y);  this.sprite.rotation = targetAngle;
        var distance=Phaser.Math.distance(this.sprite.x, this.sprite.y, x, y);
        var duration = distance*3;
        var tween = game.add.tween(this.sprite);
        tween.to({x:x,y:y}, duration);
        tween.start();
        if (!socket)
            tween.onComplete.add(this.onComplete, this);
    }
    this.onComplete=function(){
        //var nave=this.playerMap[$.cookie("usr")];
        cliente.enviarPosicion(this.sprite.x,this.sprite.y,this.sprite.rotation,this.puntos);
    }
    this.disparar=function() {

        if (game.time.now > this.bulletTime)
        {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
               this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
               this.bullet.lifespan = 1000;
               this.bullet.rotation = this.sprite.rotation;
               game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
               this.bulletTime =game.time.now + 50;
            }
        }
    }
    this.ini=function(){
        this.bullets= game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        this.bullets.createMultiple(40, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        //  Our player ship
        this.sprite = game.add.sprite(this.x, this.y, 'ship');
        this.sprite.anchor.set(0.5);

        //  and its physics settings
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(50);
        this.sprite.body.maxVelocity.set(200);
    }
    this.ini();
}
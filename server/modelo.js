function Juego(){
	this.estado=new Inicial();
	this.jugadores={};
	this.veggie=16;
	this.socket;
	this.x=200;
	this.socket;
	this.coord=[];
	this.iniciar=function(socket){
		this.socket=socket;
		this.socket.emit("coord", this.coord);
	}
	this.agregarJugador=function(id,socket){
		this.socket=socket;
		this.estado.agregarJugador(id,this);
	}
	this.puedeAgregarJugador=function(id){
		this.jugadores[id]=new Jugador(id,this.veggie)
		this.veggie++;
		if(Object.keys(this.jugadores).length>=2){
			this.estado=new Jugar();
			this.enviarAJugar();
		}
		else{
			this.enviarFaltaUno();
		}

	}
	this.reiniciar=function(){
	  this.jugadores={};
	  this.coord=[];
	  this.ini();
	  this.estado=new Inicial();
	  this.socket.broadcast.emit('reset',this.coord);
	  this.socket.emit('reset',this.coord);
	}
	
	this.enviarFaltaUno=function(){
		this.socket.emit('faltaUno');
	}

	this.enviarAJugar=function(){
		this.socket.broadcast.emit('aJugar',this.jugadores);
        this.socket.emit('aJugar',this.jugadores);

	}

	this.movimiento=function(data,socket){
		this.socket=socket;
		this.estado.movimiento(data,this);
	}

	this.puedeMover=function(data){
		if(data.puntos>=10){
			this.enviarFinal(data.id);
			this.estado=new Final();
		}else{
			this.socket.broadcast.emit('movimiento',data); 	
		}
	}
	this.volverAJugar=function(socket){
  		this.socket=socket;
  		this.estado.volverAJugar(this);
	}


	this.enviarFinal=function(id){
		this.socket.broadcast.emit('final',id);
		this.socket.emit('final',id);
	}
	this.ini=function(){
                this.veggie=randomInt(0,35);
                var otra=this.veggie+1;
                //console.log(this.veggie,"--",otra);
                for(var i=0;i<20;i++){
                        this.coord.push({'veggie':this.veggie,'x':randomInt(10,770),'y':randomInt(25,570)});
                }
                for(var i=0;i<20;i++){
                        this.coord.push({'veggie':otra,'x':randomInt(10,770),'y':randomInt(25,570)});
                }
                for(var i=0;i<50;i++){
                        var alea=randomInt(0,otra-2)
                        this.coord.push({'veggie':alea,'x':randomInt(10,770),'y':randomInt(25,570)});
                }
                for(var i=0;i<50;i++){
                        var alea=randomInt(otra++,35);
                        this.coord.push({'veggie':alea,'x':randomInt(10,770),'y':randomInt(25,570)});
                }
        }
        this.ini();

}


function Jugador(id, veggie){
	this.id=id;
	this.x=randomInt(100,400);
	this.y=randomInt(100,400);
	this.veggie=veggie;

}

function Inicial(){
	this.agregarJugador=function(id,juego){
		juego.puedeAgregarJugador(id);
	}
	this.movimiento=function(){
		console.log('No se puede mover la nave');
	}
}

function Jugar(){
	this.agregarJugador=function(id,juego){
		console.log('No se pueden agregar Jugadores');
	}
	this.movimiento=function(data,juego){
		juego.puedeMover(data);
	}
	this.volverAJugar=function(juego){
  		juego.reiniciar();
	}

}

function Final(){
	this.agregarJugador=function(id,juego){
		console.log('El juego ha acabado');
	}
	this.movimiento=function(){
		console.log('No se puede mover la nave');
	}
	this.volverAJugar=function(juego){
 		juego.reiniciar();
	}
}

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low) + low);
}
module.exports.Juego=Juego;
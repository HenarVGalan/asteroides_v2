function Cliente(nombre){
	this.socket;
	this.nombre=nombre;
	this.id;
	this.veggie;
	this.coord;
	this.room=nombre;
	this.unirmeAPartida = function(){		
    	this.socket.emit('unirme',this.room);
	};
	this.cargarConfiguracion=function(){
		this.socket.emit('configuracion',this.room);
	}

	this.nuevoJugador=function(){
		this.socket.emit('nuevoJugador',{room:this.nombre, id:this.id});
	}

	this.enviarPosicion=function(x,y,ang,puntos){
	  this.socket.emit('posicion',this.room,{"id":this.id,"x":x,"y":y,"ang":ang,"puntos":puntos})
	}

	this.ini=function(){
		this.id=randomInt(1,1000);
		this.socket=io.connect();
		this.lanzarSocketSrv();
	}

	this.reset=function(){
 		this.id=randomInt(1,10000);
	}

	this.volverAJugar=function(){
		//console.log('empieza');
  		this.socket.emit('volverAJugar',this.room); 
	}

	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect',function(){
			cli.socket.emit('room',cli.nombre);
			cli.cargarConfiguracion();
		});
		this.socket.on('faltaUno',function(data){
			console.log('Falta un jugador');
		});
		this.socket.on('coord',function(data){
			//this.coord=data;
			game.state.start('Game',true,false,data);
		});
		this.socket.on('aJugar',function(data){
			for(var jug in data){
				console.log('aJugar: ', data[jug]);
				juego.agregarJugador(data[jug].id, data[jug].x, data[jug].y, data[jug].veggie);
			}
		});

		this.socket.on("final", function(data){
			juego.finalizar(data);
		});


		this.socket.on('crearJugador',function(data){
		    juego.agregarJugador(data.id,data.x,data.y);
		});

		this.socket.on('reset',function(data){ 
			//console.log('reset');
  			juego.volverAJugar(data);
		});

		this.socket.on('todos',function(data){
			console.log(data);
		    for(var i = 0; i < data.length; i++){
		        juego.agregarJugador(data[i].id,data[i].x,data[i].y);
		    }
		});

		this.socket.on('movimiento',function(data){ 
		    juego.moverNave(data); 
		});
	}
	this.ini();
}

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low) + low);
}

// var cliente=new Cliente();

// cliente.socket.on('crearJugador',function(data){
// 	juego.agregarJugador(data.id);
// })
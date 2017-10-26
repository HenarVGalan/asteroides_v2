function Cliente() {

  this.socket;
  this.id=null;
  this.veggie;
  this.coord;
  this.cargarConfiguracion=function(){
    this.socket.emit('configuracion');
  }
  this.nuevoJugador = function() {
    this.socket.emit('nuevoJugador', {
      id: this.id
    });
  }
  this.reset=function(){
   this.id=randomInt(1,10000);
  };
  this.enviarPosicion = function(x, y, ang,puntos) {
    this.socket.emit('posicion', {
      "id": this.id,
      "x": x,
      "y": y,
      "ang": ang,
			"puntos":puntos
    })
  }
  this.volverAJugar=function(){
      this.socket.emit('volverAJugar'); 
  }
  this.ini = function() {
    this.id = randomInt(1, 1000);
    this.socket = io.connect();
    //this.lanzarSocketSrv();
  }
  this.lanzarSocketSrv = function() {
    this.socket.on('coord', function(data){
      //this.coord=data;
      game.state.start("Game", true, false, data);
    });
    this.socket.on('faltaUno', function(data) {
      console.log('Falta un jugador');
    });
    this.socket.on('aJugar', function(data) {
      for (var jug in data) {
        console.log('aJugar: ', data[jug]);
        juego.agregarJugador(data[jug].id, data[jug].x, data[jug].y, data[jug].veggie);
      }
    });
    this.socket.on('reset',function(data){ 
        juego.volverAJugar(data);
    });
    cliente.socket.on('crearJugador', function(data) {
      juego.agregarJugador(data.id, data.x, data.y);
    });

    cliente.socket.on('todos', function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        juego.agregarJugador(data[i].id, data[i].x, data[i].y);
      }
    });

		cliente.socket.on('final', function(data) {
				juego.finalizar(data);
		});

    cliente.socket.on('movimiento', function(data) {
      // juego.moverNave(data.id, data.x, data.y, data.ang);
      juego.moverNave(data);
    });
  }
  this.ini();


}

/*var cliente = new Cliente();

cliente.socket.on('crearJugador',function(data){
	juego.agregarJugador(data.id);
})*/




function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

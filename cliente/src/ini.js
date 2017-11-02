var game;
var juego;
var finJuego;
var cliente;

function borrar(){
	$('#nombre').remove();

}

function mostrarIntroducirPartida(){
	var cadena;

	cadena = "<h1>Introducir Partida</h1>";
	cadena = cadena + "<input type='text' id ='nombre'>";
	cadena = cadena + "<input type = 'submit' id = 'btn' value = 'Enviar'>";
	
	$('#partida').append(cadena); 	

	$('#btn').on('click', function(){
		var nombre = $('#nombre').val();
		if (nombre!=""){
			borrar();		
			cliente = new Cliente(nombre);
			//cliente.lanzarSocketdSrv();
			mostrarCanvas();
		}
	});

}

function mostrarCanvas(){
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

	juego = new Juego();
	finJuego = new FinJuego();

	game.state.add('Game',juego);
	game.state.add('finalizar',finJuego);
	//game.state.start('Game');
}


/*var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

var juego = new Juego();
var finJuego = new FinJuego();

game.state.add('Game',juego);
game.state.add('finalizar',finJuego);
//game.state.start('Game');

var cliente=new Cliente();

cliente.lanzarSocketSrv();
cliente.cargarConfiguracion();*/





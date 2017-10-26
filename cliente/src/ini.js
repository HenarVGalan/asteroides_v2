var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

var juego = new Juego();
var finjuego = new FinJuego();

game.state.add('Game', juego);
game.state.add('finalizar', finjuego);
//game.state.start('Game');

var cliente = new Cliente();


cliente.lanzarSocketSrv();
cliente.cargarConfiguracion();

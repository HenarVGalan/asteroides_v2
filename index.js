var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp(); //el tutorial indicaba exp.createServer()
var http = require('http').Server(app);
// Socket.io server listens to our app
var io = require('socket.io').listen(http);
var modelo=require('./server/modelo.js');
var juego = new modelo.Juego();


//app.use(app.router);
app.use(exp.static(__dirname + '/'));

app.get("/",function(request,response){ //cuando lanzas una petición al raiz del web, y en esta función te responde
        var contenido = fs.readFileSync("./cliente/views/index.html");
        response.setHeader("Content-Type", "text/html");
    	response.send(contenido);
});

console.log("Servidor escuchando en "+host+":"+port);
http.listen(port,host);

var naves=0;

io.on('connection',function(socket){

    socket.on('nuevoJugador',function(data){
      
        juego.agregarJugador(data.id,socket);
    });

    socket.on('posicion',function(data){
       // socket.jugador = {
       //      id: data.id,
       //      x: data.x,
       //      y: data.y,
       //      ang:data.ang
       //  };
       //  console.log("movimiento id:",socket.jugador.id," ",socket.jugador.x," ",socket.jugador.y);
       //  socket.broadcast.emit('movimiento',socket.jugador); 
       juego.movimiento(data,socket);
      });

    socket.on('test',function(){
        console.log('test received');
    });
});

function obtenerTodos(){
    var jugadores = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var jugador = io.sockets.connected[socketID].jugador;
        if(jugador) jugadores.push(jugador);
    });
    return jugadores;
}



// io.on('connection', function(socket) { //como el cliente intenta conectarse con el servidor, este le envia un mensaje de bienvenido
//     socket.on('nuevoJugador',function(){
//     	naves++;
//     	socket.emit('crearJugador',{id:naves});
//     }); //socket.on se queda esperando
// });
//http.listen(3000);

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low) + low);
}
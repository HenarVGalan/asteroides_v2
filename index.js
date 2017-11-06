var fs=require("fs");
// var config=JSON.parse(fs.readFileSync("config.json"));
// var host=config.host;
// var port=config.port;
var exp=require("express");
var app=exp(); //el tutorial indicaba exp.createServer()
var http = require('http').Server(app);
// Socket.io server listens to our app
var io = require('socket.io').listen(http);
var modelo=require('./server/modelo.js');
var juego = new modelo.Juego();


app.get('/obtenerPartidas', function(request, response) {
    juego.obtenerPartidas(function(lista){
        response.send(lista);        
    });
});

app.set('port', (process.env.PORT || 5000));

//app.use(app.router);
app.use(exp.static(__dirname + '/'));

app.get("/",function(request,response){ //cuando lanzas una petición al raiz del web, y en esta función te responde
        var contenido = fs.readFileSync("./cliente/views/index.html");
        response.setHeader("Content-Type", "text/html");
            response.send(contenido);
});

http.listen(app.get('port'), function(){});
// console.log("Servidor escuchando en "+host+":"+port);
// http.listen(port,host);

var naves=0;

io.on('connection',function(socket){
    socket.on('room',function(room){
        console.log('nuevoCliente: ', room);
        //socket.join(room);
        juego.nuevaPartida(room, socket);
    });
    socket.on('configuracion', function(room){
      //console.log(juego.partidas);
      juego.partidas[room].iniciar(socket,io);
    })
    socket.on('unirme',function(room){
          
        //console.log(juego.partidas);
        juego.unirme(room,socket);
    });
    socket.on('nuevoJugador',function(data){
      
        juego.partidas[data.room].agregarJugador(data.id,socket);
    });

    socket.on('posicion',function(room,data){
       juego.partidas[room].movimiento(data,socket);
      });

    socket.on('test',function(){
        console.log('test received');
    });
    socket.on('volverAJugar',function(room){
        juego.partidas[room].volverAJugar(socket);
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
//             naves++;
//             socket.emit('crearJugador',{id:naves});
//     }); //socket.on se queda esperando
// });
//http.listen(3000);

function randomInt(low, high){
        return Math.floor(Math.random() * (high - low) + low);
}
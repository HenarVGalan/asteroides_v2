var request=require("request");

var _=require("underscore");
var url='https://asteroidesv1.herokuapp.com/';
//var url='http://localhost:5000/';

//var url="http://161.67.8.34:5000/
var socket=require('socket.io-client')(url);
var socket2=require('socket.io-client')(url);
//socket=io.connect(url);


console.log("===========================================")
console.log(" Pruebas SpaceChallenge - Flujo normal");
console.log(" url="+url);

socket.on('connect',function(){
        console.log("1. Usuario: "+idTest1+" crea la partida "+nombre);
        //socket.emit('room',nombre,2);
        socket.emit('room',nombre);
        console.log("2. solicitar configuración partida "+nombre);
        socket.emit('configuracion',nombre);
});

socket2.on('connect',function(){
        console.log("-- Usuario "+idTest2+" se une a partida "+nombre);
        socket2.emit('room',nombre);
        console.log("-- solicitar configuración partida "+nombre);
        socket2.emit('configuracion',nombre);
});


socket.on('coord',function(data){
        if (data.length>0){
                console.log('3. Configuración recibida');
                coord=data;
                socket.emit('nuevoJugador',{room:nombre,id:idTest1});
        }
});

socket2.on('coord',function(data){
        if (data.length>0){
                console.log('-- Configuración recibida');
                coord=data;
                socket2.emit('nuevoJugador',{room:nombre,id:idTest2});
        }
});

socket.on('faltaUno',function(data){
        console.log("4. estado del juego: falta un jugador");
        //socket.emit('nuevoJugador',{room:nombre,id:idTest2});
});

socket.on('aJugar',function(data){
        console.log("5. estado del juego: a jugar");
        for(var jug in data){
                if (data[jug].id==idTest1){
                        console.log("Usuario "+idTest1+" correcto");
                        veg1=data[jug].veggie;
                        console.log("veg1: "+veg1);
                }
                else if (data[jug].id==idTest2){
                        console.log("Usuario "+idTest2+" correcto");
                        veg2=data[jug].veggie;
                        console.log("veg2: "+veg2);
                        moverNave1();
                }
                else
                        console.log("5. Coleccion jugadores incorrecta");
        }
        //socket.emit('nuevoJugador',{room:nombre,id:idTest2});
});

socket.on('final',function(data){
        console.log('Ganador: '+data);
        console.log("========================================== \n")
})

function moverNave1(){
        var puntos=0;
        for(var i=0;i<10;i++){
                if (coord[i].veggie==veg1){                
                        puntos++;
                        console.log("6-"+i," jugador "+idTest1+" se come "+coord[i].veggie);
                        socket.emit('posicion',nombre,{'id':idTest1,"x":coord[i].x,"y":coord[i].y,"puntos":puntos});
                }
        }
}

function moverNave2(){
        var puntos=0;
        for(var i=10;i<20;i++){
                if (coord[i].veggie==veg2){                
                        puntos++;
                        socket.emit('posicion',nombre,{'id':idTest2,"x":coord[i].x,"y":coord[i].y,"puntos":puntos});
                }
        }
}



var coord;
var nombre='partida'+randomInt(1,1000);
var idTest1=randomInt(1,10000);
var veg1;
var idTest2=idTest1+1;
var veg2;

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
//crearPartida(nombre);

//localhost:500/"


var game;
var juego;
var finJuego;
var cliente;

function borrar(){
	$('#nombre').remove();

}
function listaPartidas(lista){
	var cadena;
		for(var i=0;i<lista.length;i++){
			cadena=cadena+"<option>"+lista[i]+"</option>"
		}
		$('#sel1').append(cadena);
		$('#unirmeBtn').on('click',function(){
		  var nombre=$('#sel1').val();
			  if (nombre!=""){
				  borrar();
				  cliente=new Cliente(nombre);	  
				  cliente.unirmeAPartida();
				  //enviarUnirmeAPartida(nombre);
				  mostrarCanvas();
				}
		});
}
function obtenerPartidas(){
  $.getJSON("/obtenerPartidas",function(data){    
        //console.log(data);       
        listaPartidas(data);
  });
}

function mostrarIntroducirPartida(){
	var cadena;

	cadena = "";
	/*$('#cabecera').append(cadena);*/

	//cadena = cadena + "<form class='form-control'>";
	
	cadena = cadena + "<input class='form-control' id ='nombre' type='text'>";
	
	
	cadena = cadena + "<input class='btn btn-primary btn-block'  id = 'btn' value = 'Enviar' type = 'button' >";

/*
	cadena = cadena + "</td>";*/
	/*cadena = cadena + "</form>";*/


/*	cadena = cadena + " <form class='form-horizontal'>";
	cadena = cadena + "		<div class='form-group'>";
	cadena = cadena + "			<label class='control-label col-sm-2' for='nombrePartida'>nombrePartida:</label>";
	cadena = cadena + " 		<div class='col-sm-10'>";
	cadena = cadena + " 			<input type='nombrePartida' class='form-control' id='nombrePartida' placeholder='Nombre partida:'>";
	cadena = cadena + "	   		 </div> ";
	cadena = cadena + "	  	</div>";
	cadena = cadena + "	  </div>";
	cadena = cadena + "	  <div class='form-group'>";
	cadena = cadena + "	    <div class='col-sm-offset-2 col-sm-10'>";
    cadena = cadena + " 		<button type='submit' class='btn btn-default'>Enviar</button>" 
	cadena = cadena + "	    </div>";
	cadena = cadena + "	  </div>";
	cadena = cadena + "	</form> ";*/



	
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
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'espacio');

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





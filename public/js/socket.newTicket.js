
// stablish conection woth server 
var socket = io();
var label = $('#lblNuevoTicket');
socket.on('connect',function(){
    console.log("Conectado al servidor");
});
socket.on('disconnect',function(){
    console.log("Se perdio la conexion con el servidor");
});

socket.on('currentTicket',function(resp){
    console.log(resp);
    label.text(resp.current);//bring me the id of the current ticket
});



$('button').on('click',function(){
    console.log("Generate New Ticket");
    socket.emit('nextTicket',null,function(nextTicket){
        label.text(nextTicket);
    });
});
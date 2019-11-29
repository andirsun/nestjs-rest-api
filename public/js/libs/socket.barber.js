var socket = io();

var searchParams = new URLSearchParams(window.location.search);
if(!searchParams.has('barber')){
    window.location = 'index.html';
    throw new Error('el barbero no esta definido' );
}

var barber = searchParams.get('barber');
var label = $('small');
console.log(barber);

$('h1').text('Barber '+barber);



$('button').on('click',function(){
    socket.emit('takeTicket',{ barber:barber },function(resp){
        console.log("resp",resp);
        if(resp === "No hay tickets"){
            alert("NO hay mas tickets");
            label.text('No hay mas tickets');
            return;
        }
        label.text('Ticket '+resp.id)
    });
});

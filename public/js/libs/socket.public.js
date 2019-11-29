var socket = io();

var lblTicket1 = $('#lblTicket1');
var lblTicket2 = $('#lblTicket2');
var lblTicket3 = $('#lblTicket3');
var lblTicket4 = $('#lblTicket4');

var lblBarber1 = $('#lblBarber1');
var lblBarber2 = $('#lblBarber2');
var lblBarber3 = $('#lblBarber3');
var lblBarber4 = $('#lblBarber4');

var lblTickets =[lblTicket1,lblTicket2,lblTicket3,lblTicket4];
var lblBarbers=[lblBarber1,lblBarber2,lblBarber3,lblBarber4]; 

socket.on('currentTicket',function(data){
    refreshHTML(data.last4);
});

socket.on('last4Tickets',function(data){
    var audio = new Audio('audio/new-ticket.mp3');
    audio.play();
    refreshHTML(data.last4);//that is for update the html when a barber take the order
})

function refreshHTML(last4){
    console.log(last4);
    for(var i=0; i< last4.length; i++){
        lblTickets[i].text('Ticket '+ last4[i].id);
        lblBarbers[i].text('Barber '+ last4[i].idBarber);
    }
}
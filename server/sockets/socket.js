const { io } = require("../server");
const { TicketControl } = require("../classes/ticketControl");

const ticketControl = new TicketControl(); // instance of the class ticketContol
io.on("connection", client => {
  console.log("Server Conected");
  client.on("nextTicket", (data, callback) => {
    // here is where we listen a petition of the apps and create the ticket

    let next = ticketControl.nextTicket(data.idClient);
    console.log(next);
    callback(next);
  });

  client.emit("currentTicket", {
    current: ticketControl.getLastTicket(), //current order in proccess
    last4: ticketControl.get4LastTicket()
  });


  client.on("takeTicket", (data, callback) => {
    //when a barber push the button an take a ticket

    if (!data.barber) {
      return callback({
        response: 1,
        content: "el barbero es necesario"
      });
    }
    let takeTicket = ticketControl.takeTicket(data.barber);

    callback(takeTicket);

    client.broadcast.emit("last4Tickets", {
      //refresh the info in the front of the tickets
      last4: ticketControl.get4LastTicket()
    });
  });

  /*
    console.log('user connected'); //detection of user conection server side

    //send info to user from server side
    client.emit('enviarMensaje',{
        user:"holiwass",
        mensaje:"hi"
    });
    client.on('disconnect',()=>{
        console.log("ussuario desconectado");
    });

    //listen the client
    client.on('enviarMensaje',(data,callback)=>{//callback is to show feebback if the client send the correct response

        //console.log(data);
        client.broadcast.emit('enviarMensaje',data);//broadcast send the emit message to all clients connected
    
        // if(message.usuario){
        //     callback({
        //         response : 2,
        //         content:"todo melosque"
        //     });
        // }else{
        //     callback({
        //         response : 1,
        //         content:"todo ml"
        //     });
        // }
    })*/
});

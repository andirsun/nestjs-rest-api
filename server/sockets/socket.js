const {io} = require("../server");

io.on('connection',(client)=>{
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
    })
    
});
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const order = require("../models/orderHistory");
const temporalOrder = require("../models/temporalOrder");
const barber= require("../models/barber");
const user= require("../models/user");
const jwt = require("jsonwebtoken");
const service = require("../models/service");
const app = express();
const moment = require('moment-timezone');
require("dotenv").config();
let twilioID = "";
let twilioToken = "";
if(process.env.ENVIROMENT == "local" || process.env.ENVIROMENT == "dev"){
  //Dev or local enviroment
  twilioID = process.env.TWILIO_TEST_SID || "";
  twilioToken = process.env.TWILIO_TEST_AUTH_TOKEN || "";
}else{
  //Production Mode in other case
  twilioID = process.env.TWILIO_PRODUCTION_SID || "";
  twilioToken = process.env.TWILIO_PRODUCTION_AUTH_TOKEN || "";
}
//const wilioId = process.env.ACCOUNT_SID;
//const wilioToken = process.env.AUTH_TOKEN;
const client = require("twilio")(twilioID, twilioToken);
//const request = require('request')
var FCM = require('fcm-node');
var serverKeyBarbers = process.env.FCM_TOKEN_BARBERS; //put your server key here
var serverKeyCustomer = process.env.FCM_TOKEN; //put your server key here
var fcmBarbers = new FCM(serverKeyBarbers);
var fcmCutomer = new FCM(serverKeyCustomer);


//const timezone = require('moment-timezone');
/**********************************************/
// Functions to support api
function sendSMS(numberDestiny,message){
  client.messages.create({
    from:'+14403974927',
    to: '+57'+numberDestiny,
    body : message
  }).then(message => console.log(message.sid));
}
function sendWhatsAppMessage(numberDestiny,message){
  client.messages.create({
    from:'whatsapp:+14155238886',
    to: 'whatsapp:+57'+numberDestiny,
    body : message
  }).then(message => console.log(message.sid));
}
function sendPushMessageBarber(token,title,message){
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,
    collapse_key: 'your_collapse_key',

    notification: {
        title: title,
        body: message
    },

    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
  };
  fcmBarbers.send(message, function(err, response){
      if (err) {
        console.log("Error Sending Message!",err);
      } else {
        console.log("Successfully sent with response: ");
      }
  });
}
function sendPushMessageClient(token,title,message){
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,
    collapse_key: 'your_collapse_key',

    notification: {
        title: title,
        body: message
    },
    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
  };
  fcmCutomer.send(message, function(err, response){
      if (err) {
        console.log("Error Sending Message!",err);
      } else {
        console.log("Successfully sent with response: ");
      }
  });
}
app.get("/getInfoTemporalOrder",function(req,res){
  let idOrder = req.query.idOrder || 0 ;
  temporalOrder.findOne({id:idOrder,status:true},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content: err
      });
    }
    if(response){
      let order = response.toJSON();
      let idBarber = order.idBarber;
      let barberInfo ={}
      barber.findOne({id:idBarber},function(err,response){
        if(response){
          //if barber exists in the database
          barberInfo =response.toJSON();
        }else{
          //if no exists in the database
          barberInfo={
            id:0,
            stairs:0.0,
            numberServices:0,
            urlImg: "https://i.pinimg.com/736x/a4/93/25/a493253f2b9b3be6ef48886bbf92af58.jpg",
            name: "Sin",
            lastName : "Asignar",
            phone : "000-000-0000"
          }
        }
        user.findOne({id:order.idClient},function(err,response){
          if(err){
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(response){
            let client = response.toJSON();
            order.phoneClient = client.phone;
            return res.status(200).json({
              response: 2,
              content:{
                barber: barberInfo,
                order:order
              }
            });
          }else{
            return res.status(200).json({
              response: 1,
              content:{
                message: "No hemos encontrado ningun cliente con ese id"
              }
            });
          }
        });


      });
    }else{
      res.status(200).json({
        response: 1,
        content:{
          message: "No hemos encontrado ninguna orden con ese id o la orden puede estar inactiva"
        }
      });
    }
  });
});
app.get("/messageChrismas",function(req,res){
  User.find(function(err,resp){
    //let res = resp.toJSON();
    for(i=0;i<resp.length;i++){
      if(resp[i].name){
        let message = "JO, JO, JO.. Holaaa "+resp[i].name+", de parte del equipo de TIMUGO App de barberos a domicilio, te queremos desear una FALIZ NAVIDADDD!!!! :) ";
        console.log(message);
        console.log(resp[i].phone);
        sendSMSMessage(resp[i].phone,message);
      }


    }
    res.status(200).json({
      response: 2,
      content:"Mandamos el mensaje correctamente"
    });

  });
});
app.post("/getCurrentOrder",function(req,res){
  let body = req.body;
  let idClient = parseInt(body.id);

  temporalOrder.findOne({idClient:idClient,status:true},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 3,
        content: err
      });
    }
    if(temporalOrderDB){
      let temporal = temporalOrderDB.toJSON();

      if(temporal.idBarber != 0){
        barber.findOne({id:temporal.idBarber},function(err,barberDB){
          if (err) {
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(barberDB){
            let temporalBarber = barberDB.toJSON();
            temporal.nameBarber = temporalBarber.name;
            temporal.urlImgBarber = temporalBarber.urlImg;
            res.status(200).json({
              response: 2,
              content: {
                order:temporal,
              }
            });
          }else{
            res.status(200).json({
              response: 1,
              content:{
                message: "NO hemos encontrado ningun barbero con ese id asociado a la orden"
              }
            });
          }
        });
      }else{
        temporal.nameBarber = "Sin asignar";
        temporal.urlImgBarber = "null";
        res.status(200).json({
          response: 2,
          content: {
            order:temporal,
          }
        });
      }
    }else{
      res.status(200).json({
        response: 1,
        content: {
          message: "No tienes ninguna order en proceso."
        }
      });
    }
  });
});
app.post("/getCurrentOrderV2",function(req,res){
  let body = req.body;
  let phoneClient = body.phoneClient;
  /* Search the user Info in the database */
  user.findOne({phone:phoneClient},(err,user)=>{
    if (err) {return res.status(400).json({response: 3,content: err})};
    /* If the user exists */
    if(user){
      temporalOrder.findOne({idClient:user.id,status:true},function(err,temporalOrderDB){
        if (err) {return res.status(400).json({response: 3,content: err});}
        if(temporalOrderDB){
          let temporal = temporalOrderDB.toJSON();
    
          if(temporal.idBarber != 0){
            barber.findOne({id:temporal.idBarber},function(err,barberDB){
              if (err) {
                return res.status(500).json({
                  response: 3,
                  content: err
                });
              }
              if(barberDB){
                let temporalBarber = barberDB.toJSON();
                temporal.nameBarber = temporalBarber.name;
                temporal.urlImgBarber = temporalBarber.urlImg;
                return res.status(200).json({
                  response: 2,
                  content: {
                    order:temporal,
                  }
                });
              }else{
                return res.status(200).json({
                  response: 1,
                  content:{
                    message: "NO hemos encontrado ningun barbero con ese id asociado a la orden"
                  }
                });
              }
            });
          }else{
            temporal.nameBarber = "Sin asignar";
            temporal.urlImgBarber = "null";
            return res.status(200).json({
              response: 2,
              content: {
                order:temporal,
              }
            });
          }
        }else{
          return res.status(200).json({
            response: 1,
            content: {
              message: "No tienes ninguna order en proceso."
            }
          });
        }
      });
    }else{
      return res.status(200).json({
        response: 1,
        content:{
          message: "No encontramos a un usuario con ese celular"
        }
      });

    }
  })
  
});
/*
  Legacy version of create version, dont modify 
*/
app.post("/createOrder", function (req, res) {
  let body = req.body;
  temporalOrder.find(function (err, temporalOrderDB) {//this query is to know the number of documents
    if (err) {
      console.log( "error al buscar todas la ordenes en la base de datos");
      return res.status(400).json({
        response: 1,
        content: err
      });
    }
    //Assing all parameters to create the order
    let price = 0;
    let services = body.services;
    services = JSON.parse(services);
    services.forEach(element => {
      price = price + (element.price*element.quantity);
    });
    let id = 0
    if(temporalOrderDB.length == 0){
      //if no exists any order
      id=1
    }else{
      id=temporalOrderDB[temporalOrderDB.length-1].id + 1;
    }
    let idClient = body.idClient;
    let idBarber = body.idBarber || 0;
    let address = body.address;
    let dateBeginOrder = moment().tz('America/Bogota').format("YYYY-MM-DD");
    let hourStart = moment().tz('America/Bogota').format("HH:mm");
    let city = body.city;
    let status = body.status;
    //////////////////////////////////////
    temporalOrder.findOne({idClient:idClient,status:true},function(err,orden){
      //THIS query is to know is the user has a current order in progress
     
      if (err) {//Handlinf error in the query
        console.log("Error al buscar si el cliente ya tiene una orden activa");
        return res.status(400).json({
          response: 1,
          content: err
        });
      }
      if(orden){//If exists a orden in progress i need to return this response
        return res.status(200).json({
          response: 1,
          content: {
            message: "Upss, Aun tienes una orden en progreso. Terminala para poder pedir otra orden."
          }
        });
      }else{
        //If the user dont have a order in progress we need to create and save the temporal order
        user.findOne({id:idClient},function(err,clientDB){
          //searching the user to have his name
          
          if (err) {//Handling error in qeury
            console.log("Error al buscar al usuario con el id");
            return res.status(400).json({
              response: 1,
              content: err
            });
          }
          if(clientDB){
            let client = clientDB.toJSON();//neccesary to handle and access to parameters os the client(object)
            let order = new temporalOrder({//creating the order to save in database
              id,
              idClient,
              idBarber,
              nameClient: client.name,
              address,
              dateBeginOrder,
              hourStart,
              city,
              status,
              services,
              price:price,
              updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
            });
            let currentHour  = moment().tz('America/Bogota').format("HH");
             /* Send a SMS to Client */
            sendSMS(clientDB.phone,"Hola, Recibimos tu orden, un barbero te contactara proximamante entre 8 am - 6 pm");
            sendPushMessageClient(clientDB.phoneToken,"Hola","Recibimos tu orden, un barbero te contactara proximamante entre 8 am - 6 pm");
            order.save((err, response) => {
              
              if (err) {//handling the query error
                console.log("Error al guardar la orden nueva");
                return res.status(400).json({
                  response: 1,
                  content:{
                    err,
                    message:"Error al guardar la orden, contacta con el administrador"
                  }
                });
              }
              if (response) {
                //console.log("order Details : "+response);
                let orderMessage = "Detalle: id:"+response.id
                                +",nombre: "+response.nameClient
                                +",celular: "+client.phone
                                +",dir: "+response.address
                                + ", Valor: " + response.price ;

                let finalMessage = "Your appointment is coming up on "+"NUEVA ORDEN"+" at "+ orderMessage;
                sendWhatsAppMessage(3162452663,finalMessage);
                sendWhatsAppMessage(3106838163,finalMessage);
                console.log("Nueva Orden: " + finalMessage);
                //Sending New Order to all Barbers
                barber.find(function(err,resp){
                  for(i=0;i<resp.length;i++){
                    //The barber needs to have a phoneToken Registered and need to be connected
                    if("phoneToken" in resp[i] &&  "connected" in resp[i]){
                      //need to be connected to recieve the notification of the new order
                      if(resp[i].connected == true){
                        sendPushMessageBarber(resp[i].phoneToken,"NUEVA ORDEN ",resp[i].name + "! Tenemos una nueva orden para ti!!");
                      }
                    }
                  }
                  ////////////////////////////////////////////////////////////////////////////////////////
                  /*Sending Response of petition if the order was created correctly */

                  //Here goes the emit function ***
                  //global.socketServer.emit('newOrder', {});
                  
                  return res.status(200).json({
                    response: 2,
                    content: {
                      orderDB:response,
                      message: "Genial, Se creo la orden Correctamente, un barbero te contactara pronto."
                    }
                  });
                });
              }else{
                //If the order doesnt save return the error
                res.status(200).json({
                  response: 1,
                  content: {
                    message: "Upss, No se guardardo la orden, contacta con el administrador."
                  }
                });
              }
            });
            
          }else{
            res.status(200).json({
              response: 1,
              content: "Ups, no hemos podido encontrar ese cliente para crear la orden"
            });
          }
        });
      }
    });
  });
});
/* 
  Second version of create Orders with new
  payment methods
*/
app.post("/createTemporalOrder",function(req,res){
  //diferenciar si el metodo de pago es efectivo entonces el pendiente lo pongo en false y creo la orden sin que notifique a los barberos pero a nosotros si
  let body = req.body;
  let idClient = body.idClient;
  let currentHour  = moment().tz('America/Bogota').format("HH");
  
  temporalOrder.find(function (err, temporalOrderDB) {
    if (err) {return res.status(400).json({response: 3,content: err});}
    let id = 0
    if(temporalOrderDB.length == 0){
      //if no exists any order
      id=1
    }else{
      id=temporalOrderDB[temporalOrderDB.length-1].id + 1;
    }
    /* THIS query is to know is the user has a current order in progress */
    temporalOrder.findOne({idClient:idClient,status:true},function(err,orden){
      if (err) {//Handlinf error in the query
        return res.status(500).json({
          response: 3,
          content: err
        });
      }
      //If exists a orden in progress i need to return this response
      if(orden){
        return res.status(200).json({
          response: 1,
          content: {
            message: "Upss, Aun tienes una orden en progreso. Terminala para poder pedir otra orden."
          }
        });
      }else{
        //If the user dont have a order in progress we need to create and save the temporal order
        user.findOne({id:idClient},function(err,client){
          //searching the user to have his name
          if (err) {//Handling error in qeury
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(client){
            //Get the type of payment
            let pending = false ;
            let typePayment = body.typePayment;
            if(typePayment == "NEQUI" || typePayment =="CARD" || typePayment == "PSE" ){
                // CASH NEQUI CARD PSE
                pending = true;
            }
            //GET THE PRice of the order depends from services
            let price = 0;
            let services = body.services;
            services = JSON.parse(services);
            services.forEach(element => {
              price = price + (element.price*element.quantity);
            });
            let address = body.address;
            /* Search the address with all info */
            client.addresses.forEach(element =>{
              if(element.address == body.address){
                address = element;
              }
            });

            /* Send a SMS to Client */
            sendSMS(client.phone,"Hola, Recibimos tu orden, un barbero te contactara proximamante entre 8 am - 6 pm ");
            sendPushMessageClient(client.phoneToken,"Hola","Recibimos tu orden, un barbero te contactara proximamante entre 8 am - 6 pm ");
            //Create the new Order
            let order = new temporalOrder({//creating the order to save in database
              id,
              pending : pending,
              idClient : body.idClient,
              idBarber : body.idBarber || 0,
              nameClient: client.name,
              newAddress : address, //new Address Format
              dateBeginOrder :  moment().tz('America/Bogota').format("YYYY-MM-DD"),
              hourStart :  moment().tz('America/Bogota').format("HH:mm"),
              city : body.city,
              status : body.status,
              services,
              price:price,
              updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
            });
            //in service
            order.save((err, response) => {
              if (err) return res.status(400).json({response: 1,content:{err,message:"Error al guardar la orden, contacta con el administrador"}});
              if (response) {
                //console.log("order Details : "+response);
                let orderMessage = "Nombre: "+response.nameClient
                                +",celular: "+client.phone
                                +",dir: "+response.newAddress.address + response.newAddress.description 
                                + ", Valor: " + response.price ;
                /* Build the message to send trhow Twillio */
                let finalMessage = "Your appointment is coming up on "+"NUEVA ORDEN"+" at "+ orderMessage;
                /* Sending the message throw twillio */
                sendWhatsAppMessage(3162452663,finalMessage);
                sendWhatsAppMessage(3106838163,finalMessage);
                console.log("Nueva Orden: " + finalMessage);
                //Sending New Order to all Barbers if the order is pay with cash and is active
                if(pending == false){
                  barber.find(function(err,resp){
                    for(i=0;i<resp.length;i++){
                      //The barber needs to have a phoneToken Registered and need to be connected
                      if("phoneToken" in resp[i] &&  "connected" in resp[i]){
                        //need to be connected to recieve the notification of the new order
                        if(resp[i].connected == true){
                          sendPushMessageBarber(resp[i].phoneToken,"NUEVA ORDEN ",resp[i].name + "! Tenemos una nueva orden para ti!!");
                        }
                      }
                    }
                    
                    //Here goes the emit function ***
                    //global.socketServer.emit('newOrder', {});
                    
                    return res.status(200).json({
                      response: 2,
                      content: {
                        orderDB:response,
                        message: "Genial, Se creo la orden Correctamente, un barbero te contactara pronto."
                      }
                    });
                  });
                }else {
                  return res.status(200).json({
                    response: 2,
                    content: {
                      orderDB:response,
                      message: "Genial, Se creo la orden pero falta pagar"
                    }
                  });
                }
              }else{
                //If the order doesnt save return the error
                return res.status(200).json({
                  response: 1,
                  content: {
                    message: "Upss, No se guardardo la orden, contacta con el administrador."
                  }
                });

              }
            });

          }else{
            res.status(200).json({
              response: 1,
              content: "Ups, no hemos podido encontrar ese cliente para crear la orden"
            });
          }

        });
      }

    });
  });
  

});
/* 
  thirth  version of create Orders, this version
  must be migrated to NEST JS
*/
app.post("/orders-barbers/new",function(req,res){
  //diferenciar si el metodo de pago es efectivo entonces el pendiente lo pongo en false y creo la orden sin que notifique a los barberos pero a nosotros si
  let body = req.body;
  let phoneClient = body.phone; 
  
  temporalOrder.find(function (err, temporalOrderDB) {
    if (err) {return res.status(400).json({response: 3,content: err});}
    let id = 0
    if(temporalOrderDB.length == 0){
      //if no exists any order
      id=1
    }else{
      id=temporalOrderDB[temporalOrderDB.length-1].id + 1;
    }
   
      
    user.findOne({phone:phoneClient},function(err,client){
      //searching the user to have his name
      if (err) {//Handling error in qeury
        return res.status(500).json({
          response: 3,
          content: err
        });
      }
      if(client){
        //Get the type of payment
        let pending = false ;
        let typePayment = body.typePayment;
        if(typePayment == "NEQUI" || typePayment =="CARD" || typePayment == "PSE" ){
            // CASH NEQUI CARD PSE
            pending = true;
        }
        //GET THE PRice of the order depends from services
        let price = 0;
        let services = body.services;
        services = JSON.parse(services);
        services.forEach(element => {
          price = price + (element.price*element.quantity);
        });
        let address = body.address;
        /* Search the address with all info */
        client.addresses.forEach(element =>{
          if(element.address == body.address){
            address = element;
          }
        });

        /* Send a SMS to Client */
        sendSMS(client.phone,"Hola, Recibimos tu orden, un barbero te contactara proximamante entre 8 am - 6 pm ");
        sendPushMessageClient(client.phoneToken,"Hola","Recibimos tu orden, un barbero te contactara proximamante entre 8 am - 6 pm ");
        //Create the new Order
        let order = new temporalOrder({//creating the order to save in database
          id,
          pending : pending,
          idClient : client._id,
          idBarber : 0,
          nameClient: client.name,
          address : address,
          //newAddress : address, //new Address Format
          dateBeginOrder :  moment().tz('America/Bogota').format("YYYY-MM-DD"),
          hourStart :  moment().tz('America/Bogota').format("HH:mm"),
          status : true,
          services,
          price:price,
          updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
        });
        //in service
        order.save((err, response) => {
          if (err) return res.status(400).json({response: 1,content:{err,message:"Error al guardar la orden, contacta con el administrador"}});
          if (response) {
            let orderMessage = "Nombre: "+client.name
                            +",celular: "+client.phone
                            +",dir: "+ response.address 
                            + ", Valor: " + response.price ;
            /* Build the message to send trhow Twillio */
            let finalMessage = "Your appointment is coming up on "+"NUEVA ORDEN"+" at "+ orderMessage;
            /* Sending the message throw twillio */
            sendWhatsAppMessage(3162452663,finalMessage);
            sendWhatsAppMessage(3106838163,finalMessage);
            console.log("Nueva Orden: " + finalMessage);
            //Sending New Order to all Barbers if the order is pay with cash and is active
            if(pending == false){
              barber.find(function(err,resp){
                for(i=0;i<resp.length;i++){
                  //The barber needs to have a phoneToken Registered and need to be connected
                  if("phoneToken" in resp[i] &&  "connected" in resp[i]){
                    //need to be connected to recieve the notification of the new order
                    if(resp[i].connected == true){
                      sendPushMessageBarber(resp[i].phoneToken,"NUEVA ORDEN ",resp[i].name + "! Tenemos una nueva orden para ti!!");
                    }
                  }
                }
                
                //Here goes the emit function ***
                //global.socketServer.emit('newOrder', {});
                
                return res.status(200).json({
                  response: 2,
                  content: {
                    orderDB:response,
                    message: "Genial, Se creo la orden Correctamente, un barbero te contactara pronto."
                  }
                });
              });
            }else {
              return res.status(200).json({
                response: 2,
                content: {
                  orderDB:response,
                  message: "Genial, Se creo la orden pero falta pagar"
                }
              });
            }
          }else{
            //If the order doesnt save return the error
            return res.status(200).json({
              response: 1,
              content: {
                message: "Upss, No se guardardo la orden, contacta con el administrador."
              }
            });

          }
        });

      }else{
        res.status(200).json({
          response: 1,
          content: "Ups, no hemos podido encontrar ese cliente para crear la orden"
        });
      }

    });
      

    
  });
  

});
/* Legacy version of Finish Order */
app.post("/finishOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let comment = body.comment || "Sin comentarios";
  let status = body.status; /* "Finished | Cancelled" */
  temporalOrder.findOneAndUpdate({id:idOrder,status:true},{status:false,updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      let tempOrder = temporalOrderDB.toJSON();
      if(status =="Finished"){
        let orderPrice = tempOrder.price;
        // 30% of commission
        let orderCommission = orderPrice * 0.30;
        barber.findOneAndUpdate({id:tempOrder.idBarber},{$inc:{points:50},$inc:{balance:-orderCommission}},function(err,barberDb){//updating points to a barber
          if (err) {
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(barberDb){
            console.log("se sumaron los puntos al barbero");
          }else{
            console.log("No se le sumaron los puntos al barbero");
          }
        });
        user.findOneAndUpdate({id:tempOrder.idClient},{$inc:{points:50}},function(err,userDb){//updating points to a barber
          if (err) {
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(userDb){
            console.log("Se sumaron los punto al usuario");
          }else{
            console.log("No se le sumaron los puntos al usuario");
          }
        });
      }
      order.find(function(err,ordersDB){
        if (err) {
          return res.status(500).json({
            response: 1,
            content: err
          });
        }
        if(ordersDB){
          let id = 0
          if(ordersDB.length == 0){
            //if no exists any order
            id=1
          }else{
            id=ordersDB[ordersDB.length-1].id + 1;
          }
          let orderSave = new order({
            id : id, //autoincremental id
            idClient : tempOrder.idClient,
            idBarber: tempOrder.idBarber,
            nameBarber : tempOrder.nameBarber,
            nameClient : tempOrder.nameClient,
            address: tempOrder.address || "sin direccion",
            dateBeginOrder : tempOrder.dateBeginOrder + " "+tempOrder.hourStart,
            dateFinishOrder : moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm"),
            duration : moment(moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")).diff(moment(tempOrder.dateBeginOrder + " "+tempOrder.hourStart), 'minutes'),
            comments : comment,
            price : tempOrder.price,
            services: tempOrder.services,
            status: status,
            payMethod:"cash",
            city: tempOrder.city,
            bonusCode: "none",
            card: "none",
            commission : tempOrder.price * 0.30,
            updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
          });
          orderSave.save((err,orderDb)=>{
            if (err) {
              return res.status(500).json({
                response: 1,
                content: err
              });
            }
            if(orderDb){
              res.status(200).json({
                response: 2,
                content:{
                  orderDb,
                  message: "Se guardo la orden en el historial y se desactivo de las ordenes activas"
                }
              });
            }else{
              res.status(200).json({
                response: 1,
                content:{
                  message: "Upss. N pudimos enviar la orden al historial"
                }
              });
            }
          });
        }else{
          res.status(200).json({
            response: 1,
            content:{
              message: "NO SE PUDIERON ENCONTRAR LAS ORDENES"
            }
          });
        }
      });
    }else{
      res.status(200).json({
        response: 1,
        content:{
          message: "Upss. No concontramos esa orden o esta desactivada"
        }
      });
    }
  });
});
/* Finish Order V2 */
app.post("/finishOrCancellOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let comment = body.comment || "Sin comentarios";
  let status = body.status; /* "Finished | Cancelled" */
  temporalOrder.findOneAndUpdate({id:idOrder,status:true},{status:false,updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      let tempOrder = temporalOrderDB.toJSON();
      if(status =="Finished"){
        let orderPrice = tempOrder.price;
        // 30% of commission
        let orderCommission = orderPrice * 0.30;
        barber.findOneAndUpdate({id:tempOrder.idBarber},{$inc:{points:50},$inc:{balance:-orderCommission}},function(err,barberDb){//updating points to a barber
          if (err) {
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(barberDb){
            console.log("se sumaron los puntos al barbero");
          }else{
            console.log("No se le sumaron los puntos al barbero");
          }
        });
        user.findOneAndUpdate({id:tempOrder.idClient},{$inc:{points:50}},function(err,userDb){//updating points to a barber
          if (err) {
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(userDb){
            console.log("Se sumaron los punto al usuario");
          }else{
            console.log("No se le sumaron los puntos al usuario");
          }
        });
      }
      order.find(function(err,ordersDB){
        if (err) {
          return res.status(500).json({
            response: 1,
            content: err
          });
        }
        if(ordersDB){
          let id = 0
          if(ordersDB.length == 0){
            //if no exists any order
            id=1
          }else{
            id=ordersDB[ordersDB.length-1].id + 1;
          }
          let orderSave = new order({
            id : id, //autoincremental id
            idClient : tempOrder.idClient,
            idBarber: tempOrder.idBarber,
            nameBarber : tempOrder.nameBarber,
            nameClient : tempOrder.nameClient,
            newAddress: tempOrder.newAddress,
            address : tempOrder.address,
            dateBeginOrder : tempOrder.dateBeginOrder + " "+tempOrder.hourStart,
            dateFinishOrder : moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm"),
            duration : moment(moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")).diff(moment(tempOrder.dateBeginOrder + " "+tempOrder.hourStart), 'minutes'),
            comments : comment,
            price : tempOrder.price,
            services: tempOrder.services,
            status: status,
            payMethod:"cash",
            city: tempOrder.city,
            bonusCode: "none",
            card: "none",
            commission : tempOrder.price * 0.30,
            updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
          });
          orderSave.save((err,orderDb)=>{
            if (err) {
              return res.status(500).json({
                response: 1,
                content: err
              });
            }
            if(orderDb){
              res.status(200).json({
                response: 2,
                content:{
                  orderDb,
                  message: "Se guardo la orden en el historial y se desactivo de las ordenes activas"
                }
              });
            }else{
              res.status(200).json({
                response: 1,
                content:{
                  message: "Upss. N pudimos enviar la orden al historial"
                }
              });
            }
          });
        }else{
          res.status(200).json({
            response: 1,
            content:{
              message: "NO SE PUDIERON ENCONTRAR LAS ORDENES"
            }
          });
        }
      });
    }else{
      res.status(200).json({
        response: 1,
        content:{
          message: "Upss. No concontramos esa orden o esta desactivada"
        }
      });
    }
  });
});
app.put("/cancelOrderBarber",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder) || 0;
  //let idUser = body.idUser || 0
  temporalOrder.findOne({id:idOrder},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content: err
      });
    }
    if(response){
      let order = response.toJSON();
      let idUser = order.idClient;
      user.findOne({id:idUser},function(err,clientDb){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: err
          });
        }
        if(clientDb){
          let client = clientDb.toJSON();
          if(client.phoneToken){
            let title = "El Barbero cancelo la orden :("
            let message = "No te preopues, estamos buscando otro barbero profesional";
            let tokenClient = client.phoneToken;
            console.log("Tken del cliente" + tokenClient);
            sendPushMessageClient(tokenClient,title,message);//notify to the client about his barber assigned
            temporalOrder.findOneAndUpdate({id:idOrder},{idBarber:0,
                                                          nameBarber:"sin asignar",
                                                          updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")},
                                                          {new: true,runValidators: true},function(err,response){
              if (err) {
                return res.status(500).json({
                  response: 1,
                  content: err
                });
              }
              if(response){
                /*

                Here i need to send the free order to all barbers phone


                */
                return res.status(200).json({
                  response: 2,
                  content: response
                });
              }else{
                return res.status(200).json({
                  response: 1,
                  content: "Orden no encontrada"
                });
              }
            });
          }else{
            return res.status(200).json({
              response: 1,
              content: "No se pudo notificar al cliente"
            });
          }
        }else{
          return res.status(200).json({
            response: 1,
            content: "No se encontro al cliente con ese id"
          });
        }
      });

    }
  });


});
app.put("/editOrder",function(req,res){
  let body = req.body;
  let idOrder = body.idOrder;
  let price = 0;
  let services = body.services;
  services = JSON.parse(services);
  services.forEach(element => {
    price = price + (element.price*element.quantity);
  });
  temporalOrder.findOneAndUpdate({id:idOrder,status:true},{price:price,
                                                            services:services,
                                                            updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
                                                          },{new: true,runValidators: true},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(response){
      res.status(200).json({
        response: 2,
        content:response
      });
    }else{
      res.status(200).json({
        response: 1,
        content:"No se actualizo la orden"
      });
    }
  });
});
app.put("/assignBarberToOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let phoneBarber = parseInt(body.phoneBarber);
  temporalOrder.findOne({id:idOrder, idBarber:0},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      //let order = temporalOrderDB.toJSON();
      barber.findOne({phone:phoneBarber},function(err,barberDB){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: err
          });
        }
        if(barberDB){
          let barbero = barberDB.toJSON();
          //barber needs to has an enable account
          if(barbero.status ==true){
            //barber needs to be coonected
            if("connected" in barbero){
              if(barbero.connected == true){
                  temporalOrder.findOneAndUpdate({id:idOrder},{idBarber:barbero.id,
                                        nameBarber:barbero.name,
                                        updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
                                      },function(err,orden){
                    if (err) {
                      return res.status(500).json({
                        response: 3,
                        content:{
                          err,
                          message: "No se puedo asignar el barbero a la orden"
                        }
                      });
                    }
                    if(orden){
                      let orderJson = orden.toJSON();
                      user.findOne({id:orderJson.idClient},function(err,clientDb){
                        if (err) {
                          return res.status(500).json({
                            response: 3,
                            content: err
                          });
                        }
                        if(clientDb){
                          barber.findOne({phone:phoneBarber},function(err,response){
                            if (err) {
                              return res.status(500).json({
                                response: 3,
                                content: err
                              });
                            }
                            if(response){
                              let barber = response.toJSON();
                              let client = clientDb.toJSON();
                              let title = "Encontramos un Barbero!!"
                              let message = orderJson.nameClient+"!"
                                            +", tu barbero "+barber.name
                                            +" esta en marcha a tu direccion.";
                              let tokenClient = client.phoneToken;
                              sendPushMessageClient(tokenClient,title,message);//notify to the client about his barber assigned
                              return res.status(200).json({
                                response: 2,
                                content:{
                                  message: "Genial, se asigno a "+barbero.name+" a la orden, tambien se notifico el mensaje al cliente "+orderJson.nameClient
                                }
                              });
                            }else{
                              return res.status(200).json({
                                response: 1,
                                content:{
                                  message: "No encontramos un barbero con ese id"
                                }
                              });
                            }
                          });

                        }else{
                          res.status(200).json({
                            response: 1,
                            content:{
                              message: "Ups, no se pudo consultar al cliente de la orden"
                            }
                          });
                        }
                      });
                    }else{
                      res.status(200).json({
                        response: 1,
                        content:{
                          message: "Paso alguna monda rara"
                        }
                      });
                    }
                  });
              }else{
                return res.status(200).json({
                  response: 1,
                  content:{
                    message: "Debes estar conectado para poder asignarte a esta orden"
                  }
                });
              }
            }else{
              return res.status(200).json({
                response: 1,
                content:{
                  message: "No se encontro la propiedad connected"
                }
              });
            }
          }else{
            return res.status(200).json({
              response: 1,
              content:{
                message: "Tu cuenta esta desactivada, acude al manager de tu ciudad"
              }
            });
          }
        }else{
          return res.status(200).json({
            response: 1,
            content: {
              message: "Upssss. No encontramos a un barbero con ese id"
            }
          });
        }
      });
    }else{
      return res.status(200).json({
        response: 1,
        content: {
          message: "Upssss. No pudimos encontrar esa orden o ya fue tomada por otro barbero"
        }
      });
    }
  });
});

//14403974927 NUmero para envio de mensajes de texto
//whatsapp:+14155238886   envio de whatsapp

module.exports = app;

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
const moment = require('moment');
require("dotenv").config();
const wilioId = process.env.ACCOUNT_SID;
const wilioToken = process.env.AUTH_TOKEN;
const client = require("twilio")(wilioId, wilioToken);
const request = require('request')
var FCM = require('fcm-node');
var serverKey = process.env.FCM_TOKEN; //put your server key here
var fcm = new FCM(serverKey);


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
function sendPushMessage(token,title,message){
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
  fcm.send(message, function(err, response){
      if (err) {
          console.log("Error Sending Message!");
      } else {
          console.log("Successfully sent with response: ", response);
      }
  });
}
app.get("/sendPushNotification",function(req,res){
  sendPushMessage("eGow2nKxrr4:APA91bH3hYRK3Qe8fWwAPuvAKLCJS3JvWqfU0VVh7uDSiHjrVlzjQVAaSF8ePwnP-qSW-dDaSrsLXthLQ6dpgyX_kM5yah9tNGgUGEvl4zRRzJIlr1Riy4n63eVd3gefEiDS_iJAino3","Hola","HOla a la verga del mic");
});
function findBarber(idBarber){ // NOt working
  barber.findOne({id:idBarber},function(err,barberDb){
    let response;
    if (err) {
      response = {
        response: 1,
        content: err
      }
      return response;
    }
    if(barberDb){
      return barberDb
    }else{
      console.log("NO lo encontre");
      response ={
        response: 1,
        content: "nose encontro el barbero"
      } 
    }
    return response;
  });
}
app.get("/getInfoCurrentOrder",function(req,res){
  let idOrder = req.query.idOrder;
  temporalOrder.findOne({id:idOrder},function(err,response){
    if(err){
      return res.status(500).json({
        response: 3,
        content : err,
      });
    }
    if(response){
      let order = response.toJSON();
      let idClient = order["idClient"];
      user.findOne({id:idClient},function(err,resp){
        if(err){
          return res.status(500).json({
            response: 3,
            content : err,
          });
        }
        if(resp){
          let user = resp.toJSON();//handling parameters 
          let phoneUser= user.phone;
          order["phoneClient"]= phoneUser;
          res.status(200).json({
            response: 2,
            content :order,
          });
        }else{
          res.status(400).json({
            response: 1,
            content :"no encontramos el cliente con ese id",
          });
        }  
      });
    }else{
      res.status(400).json({
        response: 1,
        content : "Orden no encontrada con ese id",
      });
    }
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
app.post("/createOrder", function (req, res) {
  let body = req.body;
  temporalOrder.find(function (err, temporalOrderDB) {//this query is to know the number of documents 
    if (err) {
      return res.status(500).json({
        response: 3,
        content: err
      });
    }
    //Assing all parameters to create the order
    let id = temporalOrderDB.length + 1; //Autoincremental id
    let idClient = body.idClient;
    let idBarber = body.idBarber || 0;
    let address = body.address;
    let dateBeginOrder = moment().format("YYYY-MM-DD");
    let hourStart = moment().format("HH:mm");
    let typeService = body.typeService;
    let city = body.city;
    let status = body.status;
    ////////////////////////////////////////
    temporalOrder.findOne({idClient:idClient,status:true},function(err,orden){
      //THIS query is to know is the user has a current order in progress
      if (err) {//Handlinf error in the query 
        return res.status(500).json({
          response: 3,
          content: err
        });
      }
      if(orden){//If exists a orden in progress i need to return this response
        res.status(200).json({
          response: 1,
          content: {
            message: "Upss, Aun tienes una orden en progreso o pendiente por calificar. Terminala para poder pedir otra orden."
          }
        });
      }else{
        //If the user dont have a order in progress we need to create and save the temporal order
        user.findOne({id:idClient},function(err,clientDB){
          //searching the user to have his name 
          if (err) {//Handling error in qeury 
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(clientDB){
            let client = clientDB.toJSON();//neccesary to handle and access to parameters os the client(object)
            service.findOne({id:typeService},function(err,response){
              if (err) {//Handling error in qeury 
                return res.status(500).json({
                  response: 3,
                  content: err
                });
              }
              if(response){
                let serviceGet = response.toJSON();
                let order = new temporalOrder({//creating the order to save in database
                  id,
                  idClient,
                  idBarber,
                  nameClient: client.name,
                  address,
                  dateBeginOrder,
                  typeService,
                  hourStart,
                  city,
                  status,
                  price:serviceGet.price,
                });
                order.save((err, response) => {
                  if (err) {//handling the query error 
                    return res.status(500).json({
                      response: 1,
                      content:{
                        err,
                        message:"Error al guardar la orden, contacta con el administrador"
                      } 
                    });
                  }
                  if (response) {
                    //////////////////////////////Sending information of the order by whatsAPP with twillio
                    let orderWs = response.toJSON();
                    orderWs.nombreCliente = client.name+" "+client.lastName; //CLient name who take the order
                    orderWs.telefonoCliente = client.phone;
                    orderWs.Direccion=client.address;
                    orderWs.Servicio= "Corte de Cabello";
                    delete orderWs._id;
                    delete orderWs.address;
                    delete orderWs.dateBeginOrder;
                    delete orderWs.typeService;
                    delete orderWs.__v;
                    delete orderWs.hourStart;
                    delete orderWs.status;
      
                    let orderMessage = "Detalle: id:"+orderWs.id
                                        +",nombre: "+orderWs.nombreCliente
                                        +",celular: "+orderWs.telefonoCliente
                                        +",dir: "+orderWs.Direccion
                                        +","+orderWs.Servicio;
                    
                    
                    //sendSMS("3162452663",orderMessage);
                    //sendSMS("3106838163",orderMessage);
                    ////////////////////////////////////////////////////////////////////////////////////////
                    /*Sending Response of petition if the order was created correctly */
                    res.status(200).json({
                      response: 2,
                      content: {
                        orderDB:response,
                        message: "Genial, Se creo la orden Correctamente, un barbero te contactara pronto."
                      }
                    });
                  }else{
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
          }else{
            res.status(200).json({
              response: 1,
              content: "Ups, no hemos podido encontrar un servicio con ese typeService"
            });
          }
        });
      }
    });
  });
});
app.post("/finishOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let nameBarber = body.nameBarber;
  let comment = body.comment || "Sin comentarios";
  let status = body.status;
  temporalOrder.findOneAndUpdate({id:idOrder},{status:false},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      let tempOrder = temporalOrderDB.toJSON();
      Barber.findOneAndUpdate({id:tempOrder.idBarber},{$inc:{points:50}},function(err,barberDb){//updating points to a barber
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
      order.find(function(err,ordersDB){
        if (err) {
          return res.status(500).json({
            response: 1,
            content: err
          });
        }
        if(ordersDB){ 
          
          service.findOne({id:tempOrder.typeService},function(err,response){
            if (err) {
              return res.status(500).json({
                response: 1,
                content: err
              });
            }
            if(response){
              let service = response.toJSON();
              let orderSave = new order({
                id : ordersDB.length + 1,
                idClient : tempOrder.idClient,
                idBarber: tempOrder.idBarber,
                nameBarber : nameBarber,
                nameClient : tempOrder.nameClient,
                address: tempOrder.address,
                dateBeginOrder : tempOrder.dateBeginOrder + " "+tempOrder.hourStart,
                dateFinishOrder : moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm"),
                duration : 15,
                comments : comment,
                price : service.price,
                typeService : tempOrder.typeService,
                status: status,
                payMethod:"cash",
                city: tempOrder.city,
                bonusCode: "none",
                card: "none"
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
                      message: "UPss. NO pudimos enviar la orden al historial"
                    } 
                  });
                }    
              });
            }else{
              res.status(200).json({
                response: 1,
                content:{
                  message: "No se pudo obtener el precio del servicio con el id dado"
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
          message: "Upss. No concontramos esa orden"
        } 
      });
    }
  });
});
app.put("/cancelOrderBarber",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder) || 0;
  let idUser = body.idUser || 0
  temporalOrder.findOneAndUpdate({id:idOrder},{idBarber:0,nameBarber:"sin asignar"},{new: true,runValidators: true},function(err,response){
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
      console.log(idUser);
      user.findOne({id:idUser},function(err,clientDb){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: err
          });
        }
        if(clientDb){
          console.log(clientDb);
          let client = clientDb.toJSON();
          let title = "El Barbero cancelo la orden :("
          let message = "No te preopues, estamos buscando otro barbero profesional";
          let tokenClient = client.phoneToken;
          sendPushMessage(tokenClient,title,message);//notify to the client about his barber assigned
          return res.status(200).json({
            response: 2,
            content: response
          });
        }else{
          return res.status(200).json({
            response: 1,
            content: "No se pudo notificar al cliente"
          });
        }
      });
      
    }else{
      return res.status(200).json({
        response: 1,
        content: "Orden no encontrada"
      });
    }
  });
});
app.put("/assignBarberToOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let idBarber = parseInt(body.idBarber);
  temporalOrder.findOne({id:idOrder, idBarber:0},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      let order = temporalOrderDB.toJSON();
      barber.findOne({id:idBarber},function(err,barberDB){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: err
          });
        }
        if(barberDB){
          let barbero = barberDB.toJSON();
          temporalOrder.findOneAndUpdate({id:idOrder},{idBarber:barbero.id,nameBarber:barbero.name},function(err,orden){
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
              // let messageToBarber = "Hola "+barbero.name
              //                       +", Aqui esta el detalle de tu orden asignada: "
              //                       +", Nombre Cliente: "+orderJson.nameClient
              //                       +", Direccion:" +orderJson.address
              //                       +", Celular: "+ orderJson.phone
              //                       +", Servicio: Solo corte de cabello";
              user.findOne({id:orderJson.idClient},function(err,clientDb){
                if (err) {
                  return res.status(500).json({
                    response: 3,
                    content: err
                  });
                }
                if(clientDb){
                  let client = clientDb.toJSON();
                  let title = "Encontramos un Barbero !!"
                  let message = orderJson.nameClient+"!"
                                +", tu barbero "+orderJson.nameBarber
                                +" esta en marcha a tu direccion.";
                  let tokenClient = client.phoneToken;
                  sendPushMessage(tokenClient,title,message);//notify to the client about his barber assigned
                  res.status(200).json({
                    response: 2,
                    content:{
                      message: "Genial, se asigno a "+barbero.name+" a la orden, tambien se notifico el mensaje al cliente "+orderJson.nameClient
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
          res.status(200).json({
            response: 1,
            content: {
              message: "Upssss. No encontramos a un barbero con ese id"
            }
          });    
        }
      });
    }else{
      res.status(200).json({
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
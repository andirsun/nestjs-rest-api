const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const order = require("../models/orderHistory");
const temporalOrder = require("../models/temporalOrder");
const barber= require("../models/barber");
const user= require("../models/user");
const jwt = require("jsonwebtoken");
const app = express();
const moment = require('moment');
require("dotenv").config();
const wilioId = process.env.ACCOUNT_SID;
const wilioToken = process.env.AUTH_TOKEN;
const client = require("twilio")(wilioId, wilioToken);
//const timezone = require('moment-timezone');

app.post("/finishOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let stars = parseInt(body.stars) || 5;
  let comment = body.comment || "Sin comentarios";
  let status = body.status || 1//this status its if the service was complete or was cancel
  var pointsBarber = 0;
  if(stars == 1){
    pointsBarber =10;
  }
  if(stars == 2){
    pointsBarber = 20; 
  }
  if(stars == 3){
    pointsBarber = 30; 
  }
  if(stars == 4){
    pointsBarber = 40; 
  }
  if(stars == 5){
    pointsBarber = 50; 
  }
  temporalOrder.findOneAndUpdate({id:idOrder},{status:false},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      let tempOrder = temporalOrderDB.toJSON();
      barber.findOneAndUpdate({id:tempOrder.idBarber},{$inc:{points:pointsBarber}},function(err,barberDb){//updating points to a barber
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
          let orderSave = new order({
            id : ordersDB.length + 1,
            idClient : tempOrder.idClient,
            idBarber: tempOrder.idBarber,
            nameBarber : "Asignar nombre de barbero",
            address: tempOrder.address,
            dateBeginOrder : tempOrder.dateBeginOrder,
            dateFinishOrder : moment().format("YYYY-MM-DD"),
            duration : 15,
            stars : stars,
            comments : comment,
            price : 15000,
            typeService : tempOrder.typeService,
            status: status,
            payMethod:"cash",
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
})
app.put("/assignBarberToOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let idBarber = parseInt(body.idBarber);
  temporalOrder.findOne({id:idOrder},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      let order = temporalOrderDB.toJSON();
      console.log(order);
      barber.findOne({id:idBarber},function(err,barberDB){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: err
          });
        }
        if(barberDB){
          let barbero = barberDB.toJSON();
          temporalOrder.findOneAndUpdate({id:idOrder},{idBarber:barbero.id},function(err,orden){
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
              res.status(200).json({
                response: 2,
                content:{
                  message: "Genial, se asigno a "+barbero.name+" a la orden"
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
          console.log(order); 
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
          message: "Upssss. No pudimos encontrar esa orden"
        }
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
  ///Add user to DB the data is read by body of the petition
  let body = req.body;
  temporalOrder.find(function (err, temporalOrderDB) {
    if (err) {
      return res.status(500).json({
        response: 3,
        content: err
      });
    }
    let id = temporalOrderDB.length + 1; //Autoincremental id
    let idClient = body.idClient;
    let idBarber = body.idBarber || 0;
    let address = body.address;
    let dateBeginOrder = moment().format("YYYY-MM-DD");
    let hourStart = moment().format("HH:mm");
    let typeService = body.typeService;
    let status = body.status;
    let order = new temporalOrder({
      id,
      idClient,
      idBarber,
      address,
      dateBeginOrder,
      typeService,
      hourStart,
      status,
    });
    temporalOrder.findOne({idClient:idClient,status:true},function(err,orden){
      if (err) {
        return res.status(500).json({
          response: 3,
          content: err
        });
      }
      if(orden){
        console.log("entre por qye hay una orden");
        res.status(200).json({
          response: 1,
          content: {
            message: "Upss, Aun tienes una orden en progreso o pendiente por calificar. Terminala para poder pedir otra orden."
          }
        });
      }else{
        order.save((err, response) => {
          //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
          if (err) {
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
            user.findOne({id:orderWs.idClient},function(err,user){
              var userToSend = user.toJSON();
              orderWs.nombreCliente = userToSend.name+" "+userToSend.lastName; //CLient name who take the order
              orderWs.telefonoCliente = userToSend.phone;
              orderWs.Direccion=user.address;
              orderWs.Servicio= "Corte de Cabello";
              delete orderWs._id;
              delete orderWs.idBarber;
              delete orderWs.address;
              delete orderWs.dateBeginOrder;
              delete orderWs.typeService;
              delete orderWs.__v;
              delete orderWs.hourStart;
              delete orderWs.status;
              client.messages.create({
                from:'+14403974927',
                to: '+573162452663',
                body: "Detalle: id:"+orderWs.id+",nombre: "+orderWs.nombreCliente+",celular: "+orderWs.telefonoCliente+",dir: "+orderWs.Direccion+","+orderWs.Servicio
              }).then(message => console.log(message.sid));
              client.messages.create({
                from:'+14403974927',
                to: '+573106838163',
                body: "Detalle: id:"+orderWs.id+",nombre: "+orderWs.nombreCliente+",celular: "+orderWs.telefonoCliente+",dir: "+orderWs.Direccion+","+orderWs.Servicio
              }).then(message => console.log(message.sid));
              ////////////////////////////////////////////////////////////////////////////////////////
              /*Sending Response of petition if the order was created correctly */
              res.status(200).json({
                response: 2,
                content: {
                  orderDB:response,
                  message: "Genial, Se creo la orden Correctamente, un barbero te contactara pronto."
                }
              });
              /****************************************************************** */
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
      }
    });
  });
});

app.get("/testMessage",function(req,res){
  client.messages.create({
    from:'+14403974927',
    to: '+573162452663',
    body: "mensajetest"
  }).then(message => console.log(message.sid));
});
//14403974927 NUmero para envio de mensajes de texto
//whatsapp:+14155238886   envio de whatsapp

module.exports = app;
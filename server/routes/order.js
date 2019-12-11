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
                message:"Error al guardar la orden"
              } 
            });
          }
          if (response) {
            res.status(200).json({
              response: 2,
              content: {
                orderDB:response,
                message: "Temporal Order Created !!!"
              }
            });
          }else{
            res.status(200).json({
              response: 1,
              content: {
                message: "No se guardardo la orden."
              }
            });
          }
        });
      }
    });
  });
});

module.exports = app;
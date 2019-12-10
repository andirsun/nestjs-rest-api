const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Order = require("../models/orderHistory");
const temporalOrder = require("../models/temporalOrder");
const jwt = require("jsonwebtoken");
const app = express();
const moment = require('moment');
//const timezone = require('moment-timezone');


app.get("/getCurrentOrder",function(req,res){
  let body = req.body;
  let idClient = parseInt(body.id);
  
  temporalOrder.findOne({idClient:idClient},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    //Here i need to conslut the information aboout the barber and build a json with all information to return
    if(temporalOrderDB){
      res.status(200).json({
        response: 2,
        content: {
          order:temporalOrderDB,
          barber: "Aqui va la informacion del barbero"
        }
      });
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
        response: 1,
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

    order.save((err, orderDB) => {
      //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
      if (err) {
        return res.status(500).json({
          response: 1,
          content: err
        });
      }
      if (orderDB) {
        res.status(200).json({
          response: 2,
          content: {
            orderDB,
            message: "Temporal Order Created !!!"
          }
        });
      }
    });
  });
});













module.exports = app;
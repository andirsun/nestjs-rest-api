const express = require("express");
const _ = require("underscore");
const service = require("../models/service");
const jwt = require("jsonwebtoken");
const app = express();
const moment = require('moment');
//const timezone = require('moment-timezone');


app.post("/createService", function(req, res) {
    ///Add user to DB the data is read by body of the petition
    let body = req.body;
    service.find(function(err, serviceDB) {
      if (err) {
        return res.status(500).json({
          response: 1,
          content: err
        });
      }
      let id = seriviceDB.length + 1; //Autoincremental id
      let name = body.name;
      let price = body.price;
      let description = body.description;
      let urlImg = body.urlImg;
      let serviceSave = new temporalOrder({
        id,
        name,
        price,
        description,
        urlImg
      });
  
      serviceSave.save((err, serviceSaveDB) => {
        //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
        if (err) {
          return res.status(500).json({
            response: 1,
            content: err
          });
        }
        if(serviceSaveDB){
            res.status(200).json({
            response: 2,
            content: {
                serviceSaveDB,
                message: "Service Created !!!"
            }
            });
        }
      });
    });
  });











module.exports = app;
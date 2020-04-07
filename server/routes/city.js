const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Barber = require("../models/barber");
const jwt = require("jsonwebtoken");
const app = express();
const user = require("../models/user");
const Order = require("../models/orderHistory");
const City = require("../models/city");
//const moment = require('moment');
const moment = require('moment-timezone');
const service = require("../models/service")
const temporalOrder = require("../models/temporalOrder");
const fs = require('fs');


app.get("/createCity",function(req,res){
    let city = new City();
    city.id = 1;
    city.name = "Cali"
    city.save((err,response)=>{
        if(err){
            console.log(err);
        }
        if(response){
            console.log(response);
        }
    })
});
app.get("/getCities",function(req,res){
    City.find((err,response)=>{
        if (err) {
            return res.status(400).json({
              response: 3,
              content: err
            });
          }
        if(response){
            return res.status(200).json({
                response: 2,
                content:response
            });
        }else{
            return res.status(200).json({
                response: 1,
                content:{
                    message :"no se pudo obtener las ciudades  "
                }
            });
        }
    });
});











module.exports = app;
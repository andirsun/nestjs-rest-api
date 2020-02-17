const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Barber = require("../models/barber");
const jwt = require("jsonwebtoken");
const app = express();
const user = require("../models/user");
const order = require("../models/orderHistory");
//const moment = require('moment');
const moment = require('moment-timezone');
const service = require("../models/service")
const temporalOrder = require("../models/temporalOrder");

/////////////////////////////////

app.get("/getBarbersTop",function(req,res){
  Barber.find({status:true},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content: {
          error: err,
          message: "Error al buscar los barberos"
        }
      });
    }
    if(response){
      
      res.status(200).json({
        response: 2,
        content:response
      }); 
    }else{
      res.status(400).json({
        response: 1,
        content:"No Existen Barberos Top"
      }); 

    }
  });
});
app.get("/checkBarberOrder",function(req,res){
  let idBarber = req.query.idBarber;
  temporalOrder.findOne({idBarber:idBarber,status:true},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content: {
          error: err,
          message: "Error al buscar el barbero"
        }
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
        content:"El barbero no tiene ordenes en curso"
      }); 

    }
  });
});
app.get("/getBarberByPhone",function(req,res){
  let phone = req.query.phoneBarber || 0;
  phone = parseInt(phone);
  Barber.findOne({phone:phone},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content: {
          error: err,
          message: "Error al buscar el barbero"
        }
      });
    }
    if(response){
      res.status(200).json({
        response: 2,
        content:response
      }); 
    }else{
      res.status(400).json({
        response: 1,
        content:"No Existe Barbero con ese celular"
      }); 

    }
  });
});
app.post("/loginBarber" ,function(req,res){
  
  let body = _.pick(req.body, ["phone"]);
  //let body = req.query;
  Barber.findOne({phone: body.phone},function(err, user) {
      if (err) {
        return res.status(500).json({
          response: 3,
          content: {
            error: err,
            message: "Error al buscar el barbero"
          }
        });
      }
      if (user) {
        //in case that the barber exists in de data base
        let barber = user.toJSON(); //handling theresponse
        temporalOrder.findOne({idBarber:barber.id,status:true},function(err,response){
          if (err) {
            return res.status(500).json({
              response: 3,
              content: {
                error: err,
                message: "Error al buscar si un barbero tiene un pedido en curso"
              }
            });
          }
          if(response){
            res.status(200).json({
              response: 2,
              content:{
                message:"Barbero logeado, pero con pedido en curso",
                order:response
              }
                
            });    
          }else{
            res.status(200).json({
              response: 2,
              content:{
                message:"Barbero logeado correctamente",
                barber
              }
            });
          }
        });
       
      } else {
        res.json({
          response: 1,
          content:
            "Ups, no encontramos ningun barbero con ese Celular"
        });
      }
    }
  );

});
app.put("/saveBarberDeviceInfo",function(req,res){
  let body = req.body;
  let phone = body.phone;
  Barber.findOneAndUpdate({phone:phone},{
    $push : {
       deviceInfo :  {
                "appBuild":body.appBuild ,
                "appVersion":body.appVersion,
                "diskFree":body.diskFree ,
                "diskTotal":body.diskTotal,
                "isVirtual":body.isVirtual ,
                "manufacturer":body.manufacturer,
                "memUsed" :body.memUsed,
                "model":body.model,
                "operatingSystem":body.operatingSystem,
                "osVersion":body.osVersion,
                "platform" :body.platform,
              }
     },updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
  },{
    new: true,
    runValidators: true
  },function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al agregar la info del dispositivo",
          err
        } 
      });
    }
    if(response){
      res.status(200).json({
        response: 2,
        content:{
          message:"la info del dispositivo se agrego correctamente",
          user : response
        }
      });
    }else{
      res.status(400).json({
        response: 1,
        content:"no se encontro un barbero con ese celular"
      });
    }
  });
});
app.get("/getAvailableOrdersByCity",function(req,res){
  let city = req.query.city || "none";
  console.log(city);
  temporalOrder.find({city:city,status:true},function(err,response){
    if (err) {
      return res.status(400).json({
        response: 3,
        content: err
      });
    }
    if(response.length!=0){
      response = response.filter(function(item){return item.idBarber == 0;}); //delete the orders with a associated barber
      if(response.length==0){
        res.status(200).json({
          response: 1,
          content: "Ups, no hay ordenes disponibles en esa ciudad"
        });  
      }else{
        res.status(200).json({
          response: 2,
          content:response
        });
      }
    }else{
      res.status(200).json({
        response: 1,
        content: "Ups, no hay ordenes disponibles en esa ciudad"
      });
    }
  });
});
app.post("/addBarber", function(req, res) {
  ///Add user to DB the data is read by body of the petition
  let body = req.body;
  Barber.find(function(err, barberDB) {
    if (err) {
      return res.status(400).json({
        response: 1,
        content: err
      });
    }
    let id = 0 
    if(barberDB.length == 0){
      //if no exists any order
      id=1
    }else{
      id=barberDB[barberDB.length-1].id + 1;
    }
    let name = body.name;
    let lastName = body.lastName;
    let address = body.address;
    let email = body.email;
    let birth = body.birth;
    let phone = body.phone;
    let city = body.city;
    let pass = bcrypt.hashSync(body.pass, 10);
    let document = body.document;
    let bio = body.bio || "";
    let barberSave = new Barber({
      id: id,
      name: name,
      lastName: lastName,
      address: address,
      email: email,
      birth: birth,
      phone: phone,
      password: pass,
      city,
      document: document,
      bio: bio,
      updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
    });

    barberSave.save((err, barberDB) => {
      //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
      if (err) {
        return res.status(400).json({
          response: 1,
          content: err
        });
      }
      barberDB.password = null;
      res.status(200).json({
        response: 2,
        content: {
          barber: barberDB,
          message: "Barber registered !!!"
        }
      });
    });
  });
});

module.exports = app;

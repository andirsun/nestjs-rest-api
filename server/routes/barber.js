const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Barber = require("../models/barber");
const jwt = require("jsonwebtoken");
const app = express();
const temporalOrder = require("../models/temporalOrder");

/////////////////////////////////

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
        temporalOrder.findOne({idBarber:barber.id},function(err,response){
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
              content:"Barbero logeado, pero con pedido en curso"
            });    
          }else{
            res.status(200).json({
              response: 2,
              content:"Barbero logeado correctamente"
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
    let id = barberDB.length + 1; //para que es id sea autoincrementable
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
      bio: bio
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

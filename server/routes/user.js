const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const temporalOrder = require("../models/temporalOrder");
const app = express();
require("dotenv").config();
const wilioId = process.env.ACCOUNT_SID;
const wilioToken = process.env.AUTH_TOKEN;
const moment = require('moment-timezone');
const client = require("twilio")(wilioId, wilioToken);
/////////////////////////////////


function sendSMS2(numberDestiny,message){
  client.messages.create({
    from:'+14403974927',
    to: '+57'+numberDestiny,
    body : message
  }).then(message => console.log(message.sid));
}
function sendSMS(numberDestiny,message){
  client.messages.create({
    from:'whatsapp:+14155238886',
    to: 'whatsapp:+57'+numberDestiny,
    body : message
  }).then(message => console.log(message.sid));
}
app.get("/messageChrismas",function(req,res){
  User.find(function(err,resp){
    //let res = resp.toJSON();
    for(i=0;i<resp.length;i++){
      if(resp[i].name){
        let message = "JO, JO, JO.. Holaaa "+resp[i].name+", de parte del equipo de TIMUGO App de barberos a domicilio, te queremos desear una FALIZ NAVIDADDD!!!! :) ";
        console.log(message);
        console.log(resp[i].phone);
        sendSMS2(resp[i].phone,message);
      }
      
      
    }
    res.status(200).json({
      response: 2,
      content:"Mandamos el mensaje correctamente"
    });
    
  });
});
app.get("/checkUserOrder",function(req,res){
  let idUser = req.query.idUser;
  console.log(idUser);
  temporalOrder.findOne({idClient:idUser,status:true},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content: {
          error: err,
          message: "Error al buscar la orden del cliente"
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
        content:"El cliente no tiene pedidos en curos"
      }); 

    }
  });
});
app.get("/getHistoryOrders",function(req,res){
  let id = req.params.id;
  //
  //
  //
  //
  //
  //
  //
});
app.get("/getAddressesUser",function(req,res){
  let phone = req.query.phone;
  User.findOne({phone:phone},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al buscar al usuario",
          err
        } 
      });
    }if(response){
      let user = response.toJSON();
      res.status(200).json({
        response: 2,
        content:user.addresses
      });
    }else{
      res.status(400).json({
        response: 1,
        content:"no encontramos un usuario con ese id "
      });
    }
  });
});
app.get("/getUser",function(req,res){
  let phone = req.query.phone;
  User.findOne({phone:phone},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al tratar de encontrar al usuario con el numero",
          err
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
        content:"No se encontro ningun usuario con ese telefono"
      });
    }
  });
});
app.get("/sendCode",function(req,res){
  let phone = req.query.phone;
  User.findOne({phone:phone},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al tratar de encontrar al usuario con el numero",
          err
        } 
      });
    }
    if(response){
      let user = response.toJSON();
      let code = user.registrationCode;
      let message = 'Your verification code is '+code.toString();
      sendSMS(user.phone,message);
      res.status(200).json({
        response: 2,
        content:"El mensaje se envio correctamente"
      });
    }else{
      res.status(200).json({
        response: 1,
        content:"No se encontro ningun usuario con ese telefono"
      });
    }
  });
});
app.put("/addPhoneTokenUser",function(req,res){
  let body = req.body;
  let phoneUser = body.phoneUser;
  let phoneToken = body.phoneToken;
  User.findOneAndUpdate({phone:phoneUser},{$set : {phoneToken : phoneToken},
                                          updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
                                        },{new: true,runValidators: true},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al buscar al usuario con ese celular.",
          err
        } 
      });
    }
    if(response){
      res.status(200).json({
        response: 2,
        content:{
          message:"se agrego correctamente el token al usuario "+ response.name,
          user : response
        }
      });
    }else{
      res.status(400).json({
        response: 1,
        content:"no se agrego el token al usuario"
      });
    }
    
  });
})
app.put("/addAddressUser",function(req,res){
  let body = req.body;
  let phone = body.phone || 0;
  let city = body.city || "none";
  let address = body.address || "none";
  User.findOneAndUpdate({phone:phone},{
    $push : {
       addresses :  {
                "city":city ,
                "address":address,
                "favorite" :false
              } //inserted data is the object to be inserted 
     }
  },{
    new: true,
    runValidators: true
  },function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al agregar la direccion del usuario",
          err
        } 
      });
    }
    if(response){
      res.status(200).json({
        response: 2,
        content:{
          message:"la direccion se actualizo correctamente",
          user : response
        }
      });
    }else{
      res.status(400).json({
        response: 1,
        content:"no se agrego la direccion al usuario"
      });
    }
  });
});
app.put("/deleteAddressUser",function(req,res){
  let body = req.body;
  let phone = body.phone || 0;
  let address = body.address || "none";
  User.findOne({phone:phone},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al agregar la direccion del usuario",
          err
        } 
      });
    }
    if(response){
      let user = response;
      let array = []
      user.addresses.forEach(element => {
        if(element.address != address){
          array.push(element)
        }
      });
      user.addresses = array;
      user.save(function(err,response){
        if (err) {
          return res.status(500).json({
            response: 3,
            content:{
              message: "Error al agregar la direccion del usuario",
              err
            } 
          });
        }
        if(response){
          res.status(200).json({
            response: 2,
            content:{
              message:"la direcciones se actualizaron correctamente",
              user
            }
          });
        }else{
          res.status(400).json({
            response: 1,
            content:"no se elimino la direccion del usuario"
          });
        }
      });
      
    }else{
      res.status(400).json({
        response: 1,
        content:"no se encontro ningun usurio con ese celular asociado"
      });
    }

  });
});
app.put("/editInfoUser",function(req,res){
  let body = req.body;
  let phone = body.phone;
  let name = body.name || "none" ;
  let email = body.email;
  console.log(phone,name,email);
  User.findOneAndUpdate({phone:phone},{name:name,email:email},{new: true,runValidators: true},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al actualizar la informacion del usuario",
          err
        } 
      });
    }
    if(response){
      res.status(200).json({
        response: 2,
        content:"El usuario fue actualizado correctamente"
      });
    }else{
      res.status(400).json({
        response: 1,
        content:"El usuario no se actualizo"
      });
    }
  });

});
app.post("/verificationCode",function(req,res){
  let body = req.body;
  let phone = body.phone;
  let code = body.code.toString();
  User.findOne({phone:phone,registrationCode:code},function(err,response){
    if (err) {
      return res.status(500).json({
        response: 3,
        content:{
          message: "Error al tratar de encontrar al usuario con un codigo",
          err
        } 
      });
    }
    if(response){
      let user = response.toJSON();
      if(!user.name){
        res.status(200).json({
          response: 2,
          content:{
            code :1,
            message :"El usuario no esta registrado, debe seguir con el registro"
          } //1 its because user isnt registered and need to continious with the registration
        });
      }else{
        res.status(200).json({
          response: 2,
          content:{
            code : 0,
            message : "El usuario ya esta registrado, se debe enviar a los servicios"
          }, // 0 because he is already registered 
        });
      }
    }else{
      res.status(400).json({
        response: 1,
        content:"No encontramos al usuario o el codigo no coincide" //1 its because user isnt registered and need to continious with the registration
      });
    }
  });
});
app.post("/loginUser",function(req,res){
  let body = req.body;
  let phone = body.phone;
  User.find(function(err,records){
    if (err) {
      return res.status(400).json({
        response: 3,
        content: err
      });
    }
    if(records){
      User.findOne({phone:phone},function(err,response){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: err
          });
        }
        if(response){
          //if the user is already register, then we need to add other logic here
          //let code = Math.floor(100000 + Math.random() * 900000).toString(); //a number between 100.000 and 999.999
          let code = 123456;
          response["registrationCode"] = code;
          response.save((err,response)=>{
            if (err) {
              return res.status(500).json({
                response: 3,
                content: err
              });
            }
            if(response){
              let updateUser = response.toJSON();
              let message = 'Your verification code is '+updateUser.registrationCode.toString();
              sendSMS(updateUser.phone,message);
              
              
              res.status(200).json({
                response: 2,
                content:"El usuario ya esta registrado y tiene codigo nuevo enviado"
              });
            }else{
              res.status(400).json({
                response: 1,
                content:"No se le pudo actualizar el codigo"
              });
            }
          });
        }else{
          let code = Math.floor(100000 + Math.random() * 900000).toString(); //a number between 100.000 and 999.999
          let userSave = new User({
            id: records.length +1 ,            
            phone,
            registrationCode :code,
            email:phone.toString()+"@timugo.com" //temporal fix
          });
          userSave.save((err,usuarioDB)=>{
            if(err){
              return res.status(400).json({
                response: 1,
                content:{
                  err,
                  message:"No se pudo guardar al usuario en la base de datos"
                  }  
                });
            }
            if(usuarioDB){
              let user = usuarioDB.toJSON();
              let message = 'Your verification code is '+user.registrationCode.toString();
              sendSMS(user.phone,message);
              res.status(200).json({
                response: 2,
                content:"Usuario Creado Correctamente"
              });
            }else{
              console.log("entre al else");
              res.status(400).json({
                response: 1,
                content:"No se pudo calcular el numero total de usuarios"
              });        
            }
          });
        }
      });
    }else{
      res.status(400).json({
        response: 1,
        content:"No se pudo calcular el numero total de usuarios"
      });
    }
  });
});
app.post("/addUser", function(req, res) {
  ///Add user to DB the data is read by body of the petition
  let body = req.body;
  User.find(function(err, userDB) {
    if (err) {
      return res.status(500).json({
        response: 3,
        content: err
      });
    }
    let id = 0 
    if(userDB.length == 0){
      //if no exists any order
      id=1
    }else{
      id=userDB[userDB.length-1].id + 1;
    }
    let name = body.name;
    let address = body.address;
    let email = body.email;
    let phone = body.phone;
    //let pass = bcrypt.hashSync(body.pass, 10);
    let userSave = new User({
      id: id,
      name: name,
      address: address,
      email: email,
      phone: phone,
      updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
    });
    userSave.save((err, usuarioDB) => {
      //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
      if (err) {
        return res.status(400).json({
          response: 1,
          content: err
        });
      }
      usuarioDB.password = null;
      res.status(200).json({
        response: 2,
        content: {
          user: usuarioDB,
          message: "User registered !!!"
        }
      });
    });
  });
});
app.post("/login", function(req, res) {
  //Use to login and validate if a user exists
  let body = _.pick(req.body, ["email", "password"]);
  //let body = req.query;
  User.findOne(
    {
      email: body.email
    },
    function(err, user) {
      if (err) {
        return res.status(400).json({
          response: 3,
          content: {
            error: err,
            message: "Error at search for user"
          }
        });
      }
      if (user) {
        bcrypt.compare(body.password, user.password, function(err, response) {
          if (err) {
            return res.status(500).json({
              response: 3,
              content: {
                error: err,
                message: "Error comparing the encrypted password"
              }
            });
          }
          if (response) {
            let token = jwt.sign(
              {
                user: user
              },
              process.env.TOKEN_SEED,
              { expiresIn: process.env.TOKEN_EXPIRATION }
            );
            res.status(200).json({
              response: 2,
              content: {
                message: "Genial !!, te has logeado correctamente.",
                user,
                token
              }
            });
          } else {
            res.status(200).json({
              response: 1,
              content:
                "Ups, el correo o la contrasena no son correctos, revisalos e intenta de nuevo."
            });
          }
        });
      } else {
        res.json({
          response: 1,
          content:
            "Ups, el correo o la contrasena no son correctos, revisalos e intenta de nuevo."
        });
      }
    }
  );
});
app.get("/paginateQuery", function(req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);
  Usuario.find(
    {
      estado: true
    },
    "nombre email role estado google img"
  )
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      Usuario.count(
        {
          estado: true
        },
        (err, conteo) => {
          res.json({
            ok: true,
            usuarios,
            cuantos: conteo
          });
        }
      );
    });
});
app.get("/saveToken",function(req,res){
  let idStudent = req.query.idStudent;
  let token = req.query.token;
  res.status(200).json({
    response: 2,
    content: {
      idStudent,
      token
    }
  });
});
module.exports = app;

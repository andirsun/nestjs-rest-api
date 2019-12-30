const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const wilioId = process.env.ACCOUNT_SID;
const wilioToken = process.env.AUTH_TOKEN;
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
  let idUser = req.query.idUser;
  User.findOne({id:idUser},function(err,response){
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
app.put("/addAddressUser",function(req,res){
  let body = req.body;
  let id = body.idUser;
  let city = body.city || "none";
  let address = body.address || "none";
  User.findOneAndUpdate({id:id},{
    $push : {
       addresses :  {
                "city":city ,
                "address":address,
                "favorite" :false
              } //inserted data is the object to be inserted 
     }
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
      res.status(200).json({
        response: 2,
        content:"no se aniadio la direccion al usuario"
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
  User.findOneAndUpdate({phone:phone},{name:name,email:email},function(err,response){
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
          let code = Math.floor(100000 + Math.random() * 900000).toString(); //a number between 100.000 and 999.999
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
    let id = userDB.length + 1; //para que es id sea autoincrementable
    let name = body.name;
    let lastName = body.lastName;
    let address = body.address;
    let email = body.email;
    let birth = body.birth;
    let phone = body.phone;
    let pass = bcrypt.hashSync(body.pass, 10);
    let userSave = new User({
      id: id,
      name: name,
      lastName: lastName,
      address: address,
      email: email,
      birth: birth,
      phone: phone,
      password: pass
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
            return res.status(400).json({
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
app.get("/usuario", function(req, res) {
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
app.post("/usuario", function(req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});
app.get("/getMessageWelcome",function(req,res){
  res.status(200).json({
    response:2,
    content : "Bienvenido :)"
  });
});
app.put("/usuario/:id", function(req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
      runValidators: true
    },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        usuario: usuarioDB
      });
    }
  );
});
app.delete("/usuario/:id", function(req, res) {
  let id = req.params.id;

  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

  let cambiaEstado = {
    estado: false
  };

  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    {
      new: true
    },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario no encontrado"
          }
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBorrado
      });
    }
  );
});

module.exports = app;

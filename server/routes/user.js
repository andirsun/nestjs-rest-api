const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../models/user");
const Feedback = require("../models/feedback");
const jwt = require("jsonwebtoken");
const temporalOrder = require("../models/temporalOrder");
const Order = require("../models/orderHistory");
const publicityMethod = require("../models/publicityMethods");
const app = express();
require("dotenv").config();
const wilioId = process.env.ACCOUNT_SID;
const wilioToken = process.env.AUTH_TOKEN;
const moment = require('moment-timezone');
const client = require("twilio")(wilioId, wilioToken);
/////////////////////////////////


function sendSMSMessage(numberDestiny,message){
  client.messages.create({
    from:'+14403974927',
    to: '+57'+numberDestiny,
    body : message
  }).then(message => console.log(message.sid));
}
function sendWhatsAppMessage(numberDestiny,message){
  client.messages.create({
    from:'whatsapp:+14155238886',
    to: 'whatsapp:+57'+numberDestiny,
    body : message
  }).then(message => console.log(message.sid));
}
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
app.get("/checkTokenUser",function(req,res){
  let phoneUser = req.query.phoneUser;
  User.find({phone:phoneUser},function(err,user){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar al usuario",
          err
        } 
      });
    }
    if(user){
      let data = user[0].toJSON();
      if(data.phoneToken == "none"){
        return res.status(400).json({
          response: 1,
          content:"no tiene id"
        });
      }else{
        return res.status(200).json({
          response: 2,
          content:data
        });
      }
    }else{
      return res.status(400).json({
        response: 1,
        content:"no se encontro al usuario"
      });
    }
  })
});
app.get("/getHistoryOrders",function(req,res){
  let id = req.params.id;
  Order
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
app.get("/getPublicityMethods",function(req,res){
  publicityMethod.find((err,response)=>{
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al tratar de encontrar los metodos de publicidad",
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
      sendSMSMessage(user.phone,message);
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
app.get("/getPaymentCards",function(req,res){
  //phone user 
  let phoneUser = req.query.phoneUser;
  //search user by phoneUser to get paymentCards
  User.findOne({phone:phoneUser},function(err,response){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar al usuario con ese celular.",
          err
        } 
      });
    }
    if(response){
      let client = response.toJSON();
      //array to save cards
      let cardsArray = [];
      //loop into cards
      client.cards.forEach(element => {
        //get last4 numbers of cards
        let last4Numbers = element.cardNumber.slice(12,16);
        let card= {
          last4Numbers :last4Numbers,
          franchise : element.franchise,
          fullName : element.nameCard+" "+element.lastName,
          favorite : element.favorite
        }
        //add card info to response array
        cardsArray.push(card)
      });
      //return response array with cards info
      return res.status(200).json({
        response: 2,
        content:cardsArray
      });
    }else{
      //user not found
      return res.status(200).json({
        response: 1,
        content:{
          message:"no se encontro a un usuario con ese numero de telefono",
        }
      });
    }
  });
});
app.get("/getPendingRate",function(req,res){
  let phoneUser = req.query.phoneUser;
  User.findOne({phone:phoneUser},function(err,user){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar al usuario con ese celular.",
          err
        } 
      });
    }
    if(user){
      console.log(user.id);
      Order.find({idClient:user.id},function(err,orders){
        if (err) {
          return res.status(400).json({
            response: 3,
            content:{
              message: "Error al buscar las ordenes del usuario en la DB",
              err
            } 
          });
        }   
        if(orders){
          //let clientOrders = orders.toJSON();
          let lastOrder = orders[orders.length -1];
          if(!lastOrder.rate){
            return res.status(200).json({
              response: 2,
              content:lastOrder
            });    
          }else{
            //if the last order is rated ( 1 2 3 )
            if(lastOrder.rate > 0){
              return res.status(200).json({
                response: 1,
                content:{
                  message:"no tiene ordenes pendientes por calificar",
                }
              });    
            }else{
              return res.status(200).json({
                response: 2,
                content:lastOrder
              });   
            }
          }
        }else{
          return res.status(200).json({
            response: 1,
            content:{
              message:"no se encontraron ordenes para ese usario",
            }
          });    
        }
      });
    }else{
      return res.status(200).json({
        response: 1,
        content:{
          message:"no se encontro a un usuario con ese numero de telefono",
        }
      });
    }
  });
});
app.put("/addPhoneTokenUser",function(req,res){
  let body = req.body;
  console.log("telefono del usuario: "+body.phoneUser);
  console.log("token del user : "+body.phoneToken);
  let phoneUser = body.phoneUser.toString();
  let phoneToken = body.phoneToken.toString();
  
  User.findOneAndUpdate({phone:phoneUser},{$set : {phoneToken : phoneToken},
                                          updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
                                        },{new: true,runValidators: true},function(err,response){
    if (err) {
      return res.status(400).json({
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
      res.status(200).json({
        response: 1,
        content:"no se agrego el token al usuario"
      });
    }
    
  });
});
app.put("/addAddressUser",function(req,res){
  let body = req.body;
  let phone = body.phone || 0;
  let city = body.city || "none";
  let address = body.address || "none";
  let description = body.description || "none";
  let lat = body.lat;
  let lng = body.lng;
  User.findOne({phone:phone},function(err,user){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al agregar la direccion del usuario",
          err
        } 
      });
    }
    if(user){
      user.addresses.forEach(element=>{
        element.favorite = false;
      });
      console.log("aqui voy");
      let newAddress = {
        "city":city ,
        "address":address,
        "favorite" :true,
        "description":description,
        "lat":lat,
        "lng":lng
      };
      user.addresses.push(newAddress);
      user.save((err,response)=>{
        if (err) {
          return res.status(400).json({
            response: 3,
            content:{
              message: "Error al agregar la direccion del usuario",
              err
            } 
          });
        }
        if(response){
          return res.status(200).json({
            response: 2,
            content:{
              message:"la direccion se agrego correctamente",
            }
          });
        }else{
          res.status(200).json({
            response: 1,
            content:"no se agrego la direccion al usuario"
          });
        }
      });
      
    }else{
      res.status(200).json({
        response: 1,
        content:"no se encontro al usuario con ese telefono"
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
  let email = body.email || "none";
  let publicityMethod = body.publicityMethod ||"none";
  console.log(phone,name,email);
  User.findOneAndUpdate({phone:phone},{name:name,email:email,publicityMethod:publicityMethod},{new: true,runValidators: true},function(err,response){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al actualizar la informacion del usuario",
          err
        } 
      });
    }
    if(response){
      return res.status(200).json({
        response: 2,
        content:"El usuario fue actualizado correctamente"
      });
    }else{
      return res.status(200).json({
        response: 1,
        content:"El usuario no se actualizo"
      });
    }
  });
});
app.put("/setFavoriteAddress",function(req,res){
  let body = req.body;
  let phoneUser = body.phoneUser;
  let address = body.address || "none";
  User.findOne({phone:phoneUser},function(err,user){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar al usuario en la base de datos",
          err
        } 
      });
    }
    if(user){
      user.addresses.forEach(element =>{
        if(element.address == address){
          element.favorite = true;
        }else{
          element.favorite = false;
        }
      });
      //save user with the changes
      user.save((err,response)=>{
        if (err) {
          return res.status(400).json({
            response: 3,
            content:{
              message: "Error al guardar al usuario con los cambios",
              err
            } 
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
            content:"no se pudo guardar al usuario con los cambios"
          });
        }
      });
      
    }else{
      return res.status(200).json({
        response: 1,
        content:"NO se encontro ningun usuario con ese telefono"
      });
    }
  });
});
app.put("/rateOrder", function(req,res){
  let body = req.body;
  let idOrder = body.idOrder;
  //let phoneUser = body.phoneUser;
  let rate = body.rate;
  let comment = body.comment;
  Order.findOneAndUpdate({id:idOrder},{rate:rate,
                                      comments:comment,
                                      updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
                                        },{new: true,runValidators: true},function(err,response){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar la orden con ese id en la db",
          err
        } 
      });
    }
    if(response){
      res.status(200).json({
        response: 2,
        content:{
          message:"se califico correctamente la orden",
          user : response
        }
      });
    }else{
      res.status(200).json({
        response: 1,
        content:"no se encontro una orden con ese id"
      });
    }
  });
});
app.post("/saveNewCard",function(req,res){
  let body = req.body;
  let phoneUser = body.phoneUser;
  let typeCard = body.type;
  let nameCard = body.name;
  let cardNumber = body.cardNumber;
  let lastNameCard = body.lastName;
  let month = body.month;
  let year = body.year;
  let cvc = body.cvc;
  let franchise = body.franchise; 
  User.findOne({phone:phoneUser},function(err,user){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al tratar de encontrar al usuario con ese numero",
          err
        } 
      });
    }
    if(user){
      //handling the response like a json object to manipulate it
      //let user = response.toJSON();
      //the card object to save
      let cardsArray = user.cards;
      //id of the new card
      let id = 0;
      let favorite = false;
      //if the user doesnt has any card
      if(cardsArray.length == 0){
        //the card id that I`m inserting will be 1
        id = 1;
        favorite = true;
      }else{
        //if the user has already card then the id of the new card is autoincremental to the last one
        id = cardsArray[cardsArray.length-1].id + 1;
      }
      //inserting the new card
      
      console.log(id); 
      
      User.findOneAndUpdate({phone:phoneUser},{
                            $push : { 
                              cards:{
                                "id":id,
                                "favorite":favorite,
                                "type":typeCard,
                                "nameCard":nameCard,
                                "cardNumber":cardNumber,
                                "lastName":lastNameCard,
                                "monthExpiration" : month,
                                "yearExpiration":year,
                                "last4umbers":"1234",
                                "cvc":cvc,
                                "franchise":franchise,
                              }
                            }
                          },{
                            new: true,
                            runValidators: true
                          },function(err,response){
        if (err) {
          return res.status(400).json({
            response: 3,
            content:{
              message: "Error al guardar el usuario",
              err
            } 
          });
        }
        if(response){
          return res.status(200).json({
            response:2 ,
            content: user
          });
        }else{
          return res.status(200).json({
            response:1 ,
            content:"No se pudo guardar el usuario" 
          });
        }
        
      });
      
    }else{
      return res.status(200).json({
        response:1 ,
        content:"No se encontro a ningun usuario con ese celular" 
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
      return res.status(400).json({
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
        return res.status(200).json({
          response: 2,
          content:{
            code :1,
            message :"El usuario no esta registrado, debe seguir con el registro"
          } //1 its because user isnt registered and need to continious with the registration
        });
      }else{
        return res.status(200).json({
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
          let code = "";
          if(phone == 1234567891){
            //this is the only test for apple store review
            code = "123456";
            console.log("EL usuario es generico de apple");
          }else{
            console.log("Usuario nuevo, generando nuevo codigo");
            code = Math.floor(100000 + Math.random() * 900000).toString(); //a number between 100.000 and 999.999
          }
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
              sendSMSMessage(updateUser.phone,message);
              
              
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
          //If the user isnt registered then we need to create his code of registration
          let code = "";
          if(phone == 1234567891){
            //this is the only test for apple store review
            code = "123456";
            console.log("EL usuario es generico de apple");
          }else{
            console.log("Usuario nuevo, generando nuevo codigo");
            code = Math.floor(100000 + Math.random() * 900000).toString(); //a number between 100.000 and 999.999
          }
          let id = 0 
          if(records.length == 0){
            //if no exists any records in the collection
            id=1
          }else{
            console.log("El ultimo id del cliente es: "+records[records.length-1].id);
            console.log("el siguiente es : "+ (records[records.length-1].id+1));
            //if exists records then I take the last id of the last record and increment the value in 1
            id=(records[records.length-1].id + 1);
          }
          console.log("id que voy a insertar"+id);
          let userSave = new User({
            id,
            phone,
            registrationCode :code,
            email:phone.toString()+"@timugo.com" //temporal email before the people provide us the right email
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
              sendSMSMessage(user.phone,message);
              res.status(200).json({
                response: 2,
                content: usuarioDB
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
      console.log("El ultimo id del cliente es: "+userDB[userDB.length-1].id);
      console.log("el siguiente es : "+ (userDB[userDB.length-1].id+1));
      id=(userDB[userDB.length-1].id + 1);
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
app.post('/giveFeedback',function(req,res){
  let body =  req.body;
  let comment = body.comment;
  let phoneUser = body.phoneUser;
  User.findOne({phone:phoneUser},function(err,response){
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
      let client = response.toJSON();
      Feedback.find(function(err,feedbacks){
        if(err){
          return res.status(500).json({
            response: 3,
            content:{
              message: "Error al hacer fetch a la tabla de los feedbacks",
              err
            } 
          });
        }
        if(feedbacks){
          let id = 0 
          if(feedbacks.length == 0){
            //if no exists any order
            id=1
          }else{
            id=feedbacks[feedbacks.length-1].id + 1;
          }
          let feedback = new Feedback({
            id,
            updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm"),
            idUser : client.id,
            nameUser : client.name,
            feedback: comment
          });
          console.log(feedback);
          feedback.save((err,response)=>{
            if(err){
              return res.status(500).json({
                response: 3,
                content:{
                  message: "Error al guardar el feedback",
                  err
                } 
              });
            }
            if(response){
              return res.status(200).json({
                response: 2,
                content: {
                  feedback: response
                }
              });
            }else{
              return res.status(200).json({
                response: 1,
                content: "no se agrego el feedback"
              });
            }
          });
        }
      });
      
    }else{
      res.status(400).json({
        response: 1,
        content:"no encontramos a un usuario con ese phone"
      });
    }
  });
   
});
app.post('/createPublicityMethod',function(req,res){
  ///Add user to DB the data is read by body of the petition
  let body = req.body;
  publicityMethod.find(function(err, records) {
    if (err) {
      return res.status(400).json({
        response: 3,
        content: err
      });
    }
    let id = 0 
    if(records.length == 0){
      //if no exists any order
      id=1
    }else{
      id=(records[records.length-1].id + 1);
    }
    let methodSave = new publicityMethod({
      id: id,
      name: body.name,
      updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
    });
    methodSave.save((err, method) => {
      //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
      if (err) {
        return res.status(400).json({
          response: 1,
          content: err
        });
      }
      if(method){
        res.status(200).json({
          response: 2,
          content: {
            user: publicityMethod,
            message: "Method Saved"
          }
        });
      }else{
        res.status(200).json({
          response: 1,
          content: {
            message: "No se inserto el metodo"
          }
        });
      }
      
    });
  });
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

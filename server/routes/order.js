const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const order = require("../models/orderHistory");
const temporalOrder = require("../models/temporalOrder");
const barber= require("../models/barber");
const user= require("../models/user");
const jwt = require("jsonwebtoken");
const service = require("../models/service");
const app = express();
const moment = require('moment');
require("dotenv").config();
const wilioId = process.env.ACCOUNT_SID;
const wilioToken = process.env.AUTH_TOKEN;
const client = require("twilio")(wilioId, wilioToken);
const request = require('request')


//const timezone = require('moment-timezone');
/**********************************************/
// Functions to support api 
function sendSMS(numberDestiny,message){
  client.messages.create({
    from:'+14403974927',
    to: '+57'+numberDestiny,
    body : message
  }).then(message => console.log(message.sid));
}
function findBarber(idBarber){ // NOt working
  barber.findOne({id:idBarber},function(err,barberDb){
    let response;
    if (err) {
      response = {
        response: 1,
        content: err
      }
      return response;
    }
    if(barberDb){
      return barberDb
    }else{
      console.log("NO lo encontre");
      response ={
        response: 1,
        content: "nose encontro el barbero"
      } 
    }
    return response;
  });
}
app.get("/getInfoCurrentOrder",function(req,res){
  let idOrder = req.query.idOrder;
  temporalOrder.findOne({id:idOrder},function(err,response){
    if(err){
      return res.status(500).json({
        response: 3,
        content : err,
      });
    }
    if(response){
      let order = response.toJSON();
      let idClient = order["idClient"];
      user.findOne({id:idClient},function(err,resp){
        if(err){
          return res.status(500).json({
            response: 3,
            content : err,
          });
        }
        if(resp){
          let user = resp.toJSON();//handling parameters 
          let phoneUser= user.phone;
          order["phoneClient"]= phoneUser;
          res.status(200).json({
            response: 2,
            content :order,
          });
        }else{
          res.status(400).json({
            response: 1,
            content :"no encontramos el cliente con ese id",
          });
        }  
      });
    }else{
      res.status(400).json({
        response: 1,
        content : "Orden no encontrada con ese id",
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
  let body = req.body;
  temporalOrder.find(function (err, temporalOrderDB) {//this query is to know the number of documents 
    if (err) {
      return res.status(500).json({
        response: 3,
        content: err
      });
    }
    //Assing all parameters to create the order
    let id = temporalOrderDB.length + 1; //Autoincremental id
    let idClient = body.idClient;
    let idBarber = body.idBarber || 0;
    let address = body.address;
    let dateBeginOrder = moment().format("YYYY-MM-DD");
    let hourStart = moment().format("HH:mm");
    let typeService = body.typeService;
    let city = body.city;
    let status = body.status;
    ////////////////////////////////////////
    temporalOrder.findOne({idClient:idClient,status:true},function(err,orden){
      //THIS query is to know is the user has a current order in progress
      if (err) {//Handlinf error in the query 
        return res.status(500).json({
          response: 3,
          content: err
        });
      }
      if(orden){//If exists a orden in progress i need to return this response
        res.status(200).json({
          response: 1,
          content: {
            message: "Upss, Aun tienes una orden en progreso o pendiente por calificar. Terminala para poder pedir otra orden."
          }
        });
      }else{
        //If the user dont have a order in progress we need to create and save the temporal order
        user.findOne({id:idClient},function(err,clientDB){
          //searching the user to have his name 
          if (err) {//Handling error in qeury 
            return res.status(500).json({
              response: 3,
              content: err
            });
          }
          if(clientDB){
            let client = clientDB.toJSON();//neccesary to handle and access to parameters os the client(object)
            service.findOne({id:typeService},function(err,response){
              if (err) {//Handling error in qeury 
                return res.status(500).json({
                  response: 3,
                  content: err
                });
              }
              if(response){
                let serviceGet = response.toJSON();
                let order = new temporalOrder({//creating the order to save in database
                  id,
                  idClient,
                  idBarber,
                  nameClient: client.name,
                  address,
                  dateBeginOrder,
                  typeService,
                  hourStart,
                  city,
                  status,
                  price:serviceGet.price,
                });
                order.save((err, response) => {
                  if (err) {//handling the query error 
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
                    orderWs.nombreCliente = client.name+" "+client.lastName; //CLient name who take the order
                    orderWs.telefonoCliente = client.phone;
                    orderWs.Direccion=client.address;
                    orderWs.Servicio= "Corte de Cabello";
                    delete orderWs._id;
                    delete orderWs.address;
                    delete orderWs.dateBeginOrder;
                    delete orderWs.typeService;
                    delete orderWs.__v;
                    delete orderWs.hourStart;
                    delete orderWs.status;
      
                    let orderMessage = "Detalle: id:"+orderWs.id
                                        +",nombre: "+orderWs.nombreCliente
                                        +",celular: "+orderWs.telefonoCliente
                                        +",dir: "+orderWs.Direccion
                                        +","+orderWs.Servicio;
                    
                    
                    sendSMS("3162452663",orderMessage);
                    sendSMS("3106838163",orderMessage);
                    ////////////////////////////////////////////////////////////////////////////////////////
                    /*Sending Response of petition if the order was created correctly */
                    res.status(200).json({
                      response: 2,
                      content: {
                        orderDB:response,
                        message: "Genial, Se creo la orden Correctamente, un barbero te contactara pronto."
                      }
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
              }else{
                res.status(200).json({
                  response: 1,
                  content: "Ups, no hemos podido encontrar ese cliente para crear la orden"
                });
              }
            });
          }else{
            res.status(200).json({
              response: 1,
              content: "Ups, no hemos podido encontrar un servicio con ese typeService"
            });
          }
        });
      }
    });
  });
});
app.put("/assignBarberToOrder",function(req,res){
  let body = req.body;
  let idOrder = parseInt(body.idOrder);
  let idBarber = parseInt(body.idBarber);
  temporalOrder.findOne({id:idOrder, idBarber:0},function(err,temporalOrderDB){
    if (err) {
      return res.status(500).json({
        response: 1,
        content: err
      });
    }
    if(temporalOrderDB){
      let order = temporalOrderDB.toJSON();
      barber.findOne({id:idBarber},function(err,barberDB){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: err
          });
        }
        if(barberDB){
          let barbero = barberDB.toJSON();
          temporalOrder.findOneAndUpdate({id:idOrder},{idBarber:barbero.id,nameBarber:barbero.name},function(err,orden){
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
              let orderJson = orden.toJSON();
              // let messageToBarber = "Hola "+barbero.name
              //                       +", Aqui esta el detalle de tu orden asignada: "
              //                       +", Nombre Cliente: "+orderJson.nameClient
              //                       +", Direccion:" +orderJson.address
              //                       +", Celular: "+ orderJson.phone
              //                       +", Servicio: Solo corte de cabello";
              // //sendSMS(barbero.phone,messageToBarber)//notification to barber
              user.findOne({id:orderJson.idClient},function(err,clientDb){
                if (err) {
                  return res.status(500).json({
                    response: 3,
                    content: err
                  });
                }
                if(clientDb){
                  let client = clientDb.toJSON();
                  let messageToClient = "Hola "+orderJson.nameClient
                                    +", Gracias por Ordernar en Timugo, Esta es la informacion de tu Barbero"
                                    +", Nombre: "+orderJson.nameBarber
                                    +", Celular: "+ barbero.phone
                                    +". El barbero se contactara con tigo en breve.";
                  //sendSMS(client.phone,messageToClient);
                  res.status(200).json({
                    response: 2,
                    content:{
                      message: "Genial, se asigno a "+barbero.name+" a la orden, tambien se notifico el mensaje al cliente "+orderJson.nameClient
                    } 
                  });
                }else{
                  res.status(200).json({
                    response: 1,
                    content:{
                      message: "Ups, no se pudo consultar al cliente de la orden"
                    } 
                  });    
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
          message: "Upssss. No pudimos encontrar esa orden o ya fue tomada por otro barbero"
        }
      });
    }
  });
});

app.get("/test",function(req,res){
  var options = {
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST', // Don't forget this line
    headers: {
        'Authorization': 'key=AAAA1e_9gJY:APA91bH6Skb5Rm_Eid4fx2HwS9_hxqRz94JLP_EE011PlvQKyAU1nHMWCuJ1GxmDoDxIkv5X0kzmye6poNLo771OL4DKw5hUbQy1-b2n7XNIiTJ7Hc_Xpqp1g3kqlluNDsmR1CZUVECd',
        'Content-Type': 'application/json', // blah, blah, blah...
    },
    form:{
        "to":"eXPIu0eR9CA:APA91bHRSKOJW5KAzkK5jcPbjHJ-VaryhZ-57ocoW1oq0DgDNylMOJdf84wjeCRQFPAYMK-lDum_zjIg7x51CiPqpri28D7dfgykTW-GYmc5PAo9N-2bq7VsBzI1NPPLlzRoEp4yldXH",
        "notification":{
          "title":"Postman",
          "body":"BOdy desde postman"
        },
        "data":{
          "phone":"3188758481"
        } 
    }
  };
  // Create request to get data
  request(options, (err, response, body) => {
      if (err) {
          console.log(err);
      } else {
          console.log('body:',body);
      }
});
});


//14403974927 NUmero para envio de mensajes de texto
//whatsapp:+14155238886   envio de whatsapp

module.exports = app;
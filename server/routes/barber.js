const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Barber = require("../models/barber");
const jwt = require("jsonwebtoken");
const app = express();
const Order = require("../models/orderHistory");
//const moment = require('moment');
const moment = require('moment-timezone');
const service = require("../models/service")
const temporalOrder = require("../models/temporalOrder");
const fs = require('fs');

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
  let phoneBarber = req.query.phoneBarber;
  Barber.find({phone:phoneBarber},function(err,Barber){
    if (err) {
      return res.status(400).json({
        response: 3,
        content: {
          error: err,
          message: "Error al buscar el barbero"
        }
      });
    }
    if(Barber){
      let barber = Barber[0].toJSON();
      console.log("id del barbero" + barber.id);
      //need to check if this barber is enrrolled in an order 
      temporalOrder.findOne({idBarber:barber.id,status:true},function(err,response){
        if (err) {
          return res.status(500).json({
            response: 3,
            content: {
              error: err,
              message: "Error al buscar la orden temporal"
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
            content:"El barbero no tiene ordenes en curso"
          }); 
        }
      });
    }else{
      return res.status(200).json({
        response: 1,
        content:"No se encontro a un barbero con ese telefono"
      }); 
    }
  })
  
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
app.get("/getHistoryOrdersBarber",function(req,res){
  let phoneBarber = req.query.phoneBarber;
  Barber.find({phone:phoneBarber},function(err,Barber){
    if (err) {
      return res.status(400).json({
        response: 3,
        content: err
      });
    }
    if(Barber){
      let barber = Barber[0].toJSON();
      Order.find({idBarber:barber.id,status:"Finished"},function(err,response){
        if (err) {
          return res.status(400).json({
            response: 3,
            content: err
          });
        }
        if(response){
          return res.status(200).json({
            response: 2,
            content: response
          });
        }else{
          return res.status(200).json({
            response: 1,
            content: "No encontramos ordenes finalizadas de ese barbero"
          });
        }
      });
    }else{
      return res.status(200).json({
        response: 1,
        content: "No encontramos a un barbero con ese telefono"
      });
    }
    
  });
})
app.get("/getAvailableOrdersByCity",function(req,res){
  let city = req.query.city || "none";
  let phoneBarber = req.query.phoneBarber || 123;
  Barber.find({phone:phoneBarber},function(err,Barber){
    if (err) {
      return res.status(400).json({
        response: 3,
        content: err
      });
    }
    let barber = Barber[0].toJSON();
    //barber need to hacve connected property
    if("connected" in barber){
      //barber need to be connected to recieve new orders
      if(barber.connected ==true){
        //barber need to has a enable account
        if(barber.status ==true){
          //search a available orders by city
          temporalOrder.find({city:city,status:true},function(err,response){
            if (err) {
              return res.status(400).json({
                response: 3,
                content: err
              });
            }
            if(response.length!=0){
              //delete the orders with a associated barber
              response = response.filter(function(item){return item.idBarber == 0;});
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
              return res.status(200).json({
                response: 1,
                content: "Ups, no hay ordenes disponibles en esa ciudad"
              });
            }
          });
        }else{
          //barber account is disable 
          return res.status(200).json({
            response: 1,
            content: "Tu cuenta esta desactivada, debes contactar con el Administrador de tu ciudad"
          });  
        }
      }else{
        //barber isn connected
        return res.status(200).json({
          response: 1,
          content: "Debes estar conectado para recibir ordenes"
        });
      }
    }else{
      return res.status(200).json({
        response: 1,
        content: "Ups, no hay propiedad de conectado"
      });
    }
  });
});
app.get("/checkIfBarberConnect",function(req,res){
  let phoneBarber = req.query.phoneBarber;
  Barber.findOne({phone:phoneBarber},function(err,response){ 
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar a un barbero con ese id",
          err
        } 
      });
    }
    if(response){
      let barber = response.toJSON();
      if("connected" in barber){
        if(barber.connected){
          return res.status(200).json({
            response: 2,
            content:{
              message:"El barbero esta conectado"
            }
          });
        }else{
          return res.status(200).json({
            response: 1,
            content:{
              message:"el barbero no esta conectado"
            }
          });
        }
      }else{
        return res.status(200).json({
          response: 1,
          content:{
            message:"no encontramos la variable de conexion"
          }
        });  
      }
    }else{
      return res.status(200).json({
        response: 1,
        content:{
          message:"No encontramos a un barbero con ese numero"
        }
      });
    }
  });
});
app.get("/getBarberHistoryOrders",function(req,res){
  let idBarber = req.query.idBarber;
  Order.find({idBarber:idBarber},function(err,orders){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar las ordenes en la bd",
          err
        } 
      });
    }
    if ( orders.length > 0 ) {
      return res.status(200).json({
        response : 2,
        content : orders
      });
    } else {
      return res.status(200).json({
        response : 1,
        content : "no se encontraron ordenes para ese barbero"
      });
    }
  });
});
app.get("/getBarberBalance",function(req,res){
  let phoneBarber = req.query.phoneBarber;
  Barber.findOne({phone:phoneBarber},function(err,barber){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar al barbero en la bd",
          err
        } 
      });
    }
    if(barber){
      return res.status(200).json({
        response : 2,
        content :{
          balance : barber.balance,
          points : barber.points
        } 
      });
    }else{
      return res.status(200).json({
        response : 1,
        content : "no se encontro el saldo de este barbero"
      });
    }
  });
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
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al agregar la info del dispositivo",
          err
        } 
      });
    }
    if(response){
      return res.status(200).json({
        response: 2,
        content:{
          message:"la info del dispositivo se agrego correctamente",
          user : response
        }
      });
    }else{
      return res.status(400).json({
        response: 1,
        content:"no se encontro un barbero con ese celular"
      });
    }
  });
});
app.put("/connectOrDisconnectBarber",function(req,res){
  let body = req.body;
  let phoneBarber = body.phoneBarber;
  Barber.findOne({phone:phoneBarber},(err,barber)=>{
    if(err){
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar al barbero con ese celular.",
          err
        } 
      });
    }
    if(barber){
      //if barber is connected
      if(barber.connected == true){
        barber.connected = false;
      }else{
        barber.connected = true
      }
      //save the barber with the new state of conection
      barber.save((err,response)=>{
        if(err){
          return res.status(400).json({
            response: 3,
            content:{
              message: "Error al actualizar la conexion del barbero en la base de datos",
              err
            } 
          });
        }
        if(response){
          return res.status(200).json({
            response: 2,
            content:{
              message:"Se conecto o desconecto al barbero "+ response.name,
              user : response
            }
          });
        }else{
          return res.status(200).json({
            response: 1,
            content:"no se pudo actualizar el estado de conexion del barbero"
          });
        }   
      });
    }else{
      return res.status(200).json({
        response: 1,
        content:"no se pudo conectar el barbero"
      });
    }
  })
  
});
app.put("/addPhoneTokenBarber",function(req,res){
  let body = req.body;
  console.log("telefono del barbero: "+body.phoneBarber);
  console.log("token del barbero : "+body.phoneToken);
  let phoneBarber = body.phoneBarber.toString();
  let phoneToken = body.phoneToken.toString();
  
  Barber.findOneAndUpdate({phone:phoneBarber},{$set : {phoneToken : phoneToken},
                                          updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
                                        },{new: true,runValidators: true},function(err,response){
    if (err) {
      return res.status(400).json({
        response: 3,
        content:{
          message: "Error al buscar al barbero con ese celular.",
          err
        } 
      });
    }
    if(response){
      return res.status(200).json({
        response: 2,
        content:{
          message:"se agrego correctamente el token al barbero "+ response.name,
          user : response
        }
      });
    }else{
      return res.status(200).json({
        response: 1,
        content:"no se agrego el token al barbero"
      });
    }
    
  });
})
app.put('/uploadProfileImageBarber',function(req,res){
  if (!req.files || Object.keys(req.files).length === 0) { //si ningun archivo es detectado en la peticion que se envio
    return res.status(400).json({
        response : 1,
        error:{
          message: "No se ha seleccionado ningun archivo"
        }
    });
  }
  let file = req.files.archivo;//el nombre del input en html debe ser para este caso "archivo"
  let fileName = file.name.split('.');//para sacar la extencion del archivo 
  let extention = fileName[fileName.length-1] ;

  // Extenciones permitidas para cargar al servidor
  let extenciones = ['png','jpg','gif','jpeg'];
  // Validando extencion del archivo 
  if (extenciones.indexOf(extention)<0){
    return res.status(400).json({
      response:1,
      content:{
        message: 'tu extencion de archivo es :'+extention+', pero las extenciones permitidas son : '+ extenciones.join(', ')
      }
    });
  }
  //Moving FIle
  file.mv('public/assets/images/barbers/'+file.name, (err) => {
    if (err)
      return res.status(500).json({
        response : 1,
        content:{
          message : "ocurrio un error mientras se movia el archivo al directorio" ,
          error: err
        }
      });
    res.json({
      response : 2,
      content: {
        message: "la imagen se subio correctamente!!!"
      }
    });
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
        /*temporalOrder.findOne({idBarber:barber.id,status:true},function(err,response){
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
        });*/
        return res.status(200).json({
          response: 2,
          content:{
            message:"Barbero logeado correctamente",
            barber
          }
        });
      } else {
        return res.json({
          response: 1,
          content:
            "Ups, no encontramos ningun barbero con ese Celular"
        });
      }
    }
  );

});
app.post('/uploadImageToBarber',function(req,res){
  if (!req.files || Object.keys(req.files).length === 0) { //si ningun archivo es detectado en la peticion que se envio
    return res.status(400).json({
        response : 1,
        error:{
          message: "No se ha seleccionado ningun archivo"
        }
    });
  }
  let body = req.body;
  let phoneBarber  = body.phoneBarber;
  let file = req.files.archivo;//el nombre del input en html debe ser para este caso "archivo"
  let fileName = file.name.split('.');//para sacar la extencion del archivo 
  let extention = fileName[fileName.length-1] ;

  // Extenciones permitidas para cargar al servidor
  let extenciones = ['png','jpg','gif','jpeg'];
  // Validando extencion del archivo 
  if (extenciones.indexOf(extention)<0){
    return res.status(400).json({
      response:1,
      content:{
        message: 'tu extencion de archivo es :'+extention+', pero las extenciones permitidas son : '+ extenciones.join(', ')
      }
    });
  }
  Barber.find({phone:phoneBarber},function(err,response){
    if(err){
      return res.status(400).json({
        response : 1,
        content:{
          error: err
        }
      });
    }
    if(response){
      let barber  = response[0].toJSON();
      let documentBarber = barber.document;if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
      let dir
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      //Moving FIle
      file.mv('public/assets/images/barbersAssets/'+file.name, (err) => {
        if (err)
          return res.status(400).json({
            response : 1,
            content:{
              message : "ocurrio un error mientras se movia el archivo al directorio" ,
              error: err
            }
          });
        return res.json({
          response : 2,
          content: {
            message: "la imagen se subio correctamente!!!"
          }
        });
      });    
    }else{
      return res.json({
        response : 1,
        content: {
          message: "No se encontro a ningun barbero con ese telefono"
        }
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
    //let pass = bcrypt.hashSync(body.pass, 10);
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

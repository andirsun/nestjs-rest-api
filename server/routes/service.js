const express = require("express");
const _ = require("underscore");
const Service = require("../models/service");
const AditionalService = require("../models/aditionalService");
const jwt = require("jsonwebtoken");
const app = express();
const moment = require('moment');
//const timezone = require('moment-timezone');


app.post("/createService", function (req, res) {
    ///Add user to DB the data is read by body of the petition
    let body = req.body;
    Service.find(function (err, serviceDB) {
        if (err) {
            return res.status(500).json({
                response: 1,
                content: err
            });
        }
        let id = serviceDB[serviceDB.length-1].id + 1; //Autoincremental id
        let name = body.name;
        let price = body.price;
        let description = body.description;
        let urlImg = body.urlImg;
        let serviceSave = new Service({
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
            if (serviceSaveDB) {
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
app.post("/createAditionalService", function (req, res) {
    ///Add user to DB the data is read by body of the petition
    let body = req.body;
    AditionalService.find(function (err, serviceDB) {
        if (err) {
            return res.status(500).json({
                response: 1,
                content: err
            });
        }
        let id =serviceDB[serviceDB.length-1].id + 1; //Autoincremental id
        let name = body.name;
        let price = body.price;
        let description = body.description;
        let urlImg = body.urlImg || "" ;
        let aditionalServiceSave = new AditionalService({
            id,
            name,
            price,
            description,
            urlImg
        });

        aditionalServiceSave.save((err, serviceSaveDB) => {
            //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
            if (err) {
                return res.status(500).json({
                    response: 1,
                    content: err
                });
            }
            if (serviceSaveDB) {
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
app.get("/getAditionalServices",function(req,res){
    let service = req.query.service ||0;

    AditionalService.find(function(err,response){
        if (err) {
            return res.status(500).json({
                response: 3,
                content: err
            });
        }
        if(response){
            let aditionalServices = JSON.stringify(response);
            aditionalServices = JSON.parse(aditionalServices)
            let array = [];
            let cejas = {
                name:"cejas",
                price:"0"
            }
            if(service==1){
                return res.status(200).json({
                    response: 2,
                    content: response
                });    
            }
            if(service==2){
                let arrayService =[]
                arrayService.push(aditionalServices[1]);
                return res.status(200).json({
                    response: 2,
                    content: arrayService//temporal fix
                });
            }
            res.status(200).json({
                response: 1,
                content: "No se encontraron servicios adicionales para ese servicio"
            });
        }else{
            res.status(400).json({
                response: 1,
                content: "ups, no hemos encontrado los servicios"
            });
        }
    });
});
app.get("/getServices",function(req,res){
    Service.find(function(err,serviceDB){
        if (err) {
            return res.status(500).json({
                response: 3,
                content: err
            });
        }
        if(serviceDB){
            res.status(200).json({
                response: 2,
                content: serviceDB
            });
        }
    });
});










module.exports = app;
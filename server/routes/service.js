const express = require("express");
const _ = require("underscore");
const Service = require("../models/service");
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
        let id = serviceDB.length + 1; //Autoincremental id
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
app.get("/getAditionalServices",function(req,res){
    let service = req.query.service ||0;

    Service.find(function(err,response){
        if (err) {
            return res.status(500).json({
                response: 3,
                content: err
            });
        }
        if(response){
            let array = [];
            let cejas = {
                name:"cejas",
                price:"0"
            }
            if(service==1){
                array.push(cejas);
                array.push(response[1]);//temporal fix , here im only adding the eye brown service
            }
            if(service==2){
                array.push(cejas);
            }
            res.status(200).json({
                response: 2,
                content: array
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
    service.find(function(err,serviceDB){
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
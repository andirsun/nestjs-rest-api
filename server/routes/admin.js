const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Barber = require("../models/barber");
const jwt = require("jsonwebtoken");
const app = express();
const user = require("../models/user");
const Order = require("../models/orderHistory");
//const moment = require('moment');
const moment = require('moment-timezone');
const service = require("../models/service")
const temporalOrder = require("../models/temporalOrder");
const fs = require('fs');

app.get("/adminMetrics",function(req,res){
    let body  = req.body;
    //Read dates from body of petition in string format "YYYY-MM-DD"
    let firstDate = body.firstDate || "0000-00-00 00:00";
    let secondlDate = body.secondDate || "0000-00-00";
    //Transform the string dates to momentjs dates to manage and compare dates
    let initialDate = moment(firstDate,"YYYY-MM-DD HH:mm");
    let finalDate  = moment(secondlDate,"YYYY-MM-DD HH:mm");
    Order.find(function(err,response){
        if (err) {
            return res.status(400).json({
                response: 3,
                content: {
                    error: err,
                    message: "Error al comparar las fechas"
                }
            });
        }
        let totalOrders = 0 ;
        let finishedOrders = 0;
        let hairCuts = 0 ;
        let shaves = 0
        let cancelledOrders = 0 ;
        let revenue = 0;
        if(response){
            for(i=0;i<response.length;i++){
                let orderDate = moment(response[i].dateBeginOrder, "YYYY-MM-DD HH:mm");
                if(orderDate >= initialDate && orderDate <= finalDate){
                    if(response[i].status = "Finished"){
                        //increase number of orders
                        finishedOrders++;
                        for(j=0;j < response[i].services.length; j++){
                            if(response[i].services[j].nameService == "Corte de Cabello"){
                                hairCuts++;
                            }else{
                                shaves++;       
                            }
                        }
                    }else{
                        cancelledOrders++;
                    }
                    totalOrders++;
                    revenue+=response[i].price;
                }
              }
            return res.status(200).json({
                response: 2,
                content:{
                    totalOrders,
                    finishedOrders,
                    cancelledOrders,
                    hairCuts,
                    shaves,
                    revenue
                }
            });

        }else{
            return res.status(200).json({
                response: 1,
                content:  "No hay datos entre esas fechas"
            });
        }
    });
});

app.get("/searchUser",function(req,res){

});
module.exports = app;

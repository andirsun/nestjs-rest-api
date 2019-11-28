const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Barber = require('../models/barber');
const jwt = require('jsonwebtoken');
const app = express();
/////////////////////////////////
app.post('/addBarber', function (req, res) { ///Add user to DB the data is read by body of the petition     
    let body = req.body;
    Barber.find(function (err, barberDB) {
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
            document:document,
            bio:bio
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
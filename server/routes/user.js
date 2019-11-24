const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const app = express();
/////////////////////////////////

app.post('/addUser', function (req, res) { ///Add user to DB the data is read by body of the petition     
    let body = req.body;
    User.find(function (err, userDB) {
        if (err) {
            return res.status(400).json({
                response: 1,
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
app.post('/login', function (req, res) {
    //Use to login and validate if a user exists
    let body = _.pick(req.body, ['email', 'password']);   
    //let body = req.query;
    User.findOne({
        email: body.email
    }, function (err, user) {
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
                if(response){
                    res.status(200).json({
                        response: 2,
                        content: "Genial !!, te has logeado correctamente.",
                        token:123,
                    });
                }else{
                    res.status(200).json({
                        response: 1,
                        content: "Ups, el correo o la contrasena no son correctos, revisalos e intenta de nuevo."
                    });
                }
            });
        }else{
            res.json({
                response: 1,
                content: "Ups, el correo o la contrasena no son correctos, revisalos e intenta de nuevo."
            });
        }
    });
});
app.get('/usuario', function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({
            estado: true
        }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({
                estado: true
            }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });
        });
});
app.post('/usuario', function (req, res) {

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

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {

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

    })

});

app.delete('/usuario/:id', function (req, res) {


    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, {
        new: true
    }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});



module.exports = app;
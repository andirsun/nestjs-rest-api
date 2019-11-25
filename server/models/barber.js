const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos= {
    values: ['REGULAR','VIP'],
    message: '{VALUE} no es un metodo de pago valido'
};
let Schema = mongoose.Schema;

let barber = new Schema({
    id:{
        type:Number,
        require:[true,'EL id es necesario'],
        default: 0
    },
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    phone: {
        type: Number,
        unique: true, 
        required: [true, 'Es necesario el numero de celular']
    },
    lastName: {
        type: String,
        required: [true, 'Los apellidos son necesarios']
    },
    birth: {
        type: Date,
        required: [true, 'La edad es necesaria']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Este correo ya esta registrado']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    address: {
        type: String,
        required: [true, 'La direccion es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'REGULAR',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    }
});



barber.methods.toJSON = function() {

    let barber = this;
    let barberObject = barber.toObject();
    delete barberObject.password;
    return barberObject;
}


barber.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Barber', barber);
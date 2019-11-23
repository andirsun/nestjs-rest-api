const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['USER_ROLE','USER_VIP_ROLE'],
    message: '{VALUE} no es un rol válido'
};
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    id:{
        type:Number,
        require:[true,'EL id es necesario'],
        default: 0
    },
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
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
        required: [true, 'El correo es necesario']
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
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Usuario', usuarioSchema);
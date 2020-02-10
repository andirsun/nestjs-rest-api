const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["REGULAR", "VIP"],
  message: "{VALUE} no es un metodo de pago valido"
};
let Schema = mongoose.Schema;

let barber = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:false, 
  },
  name: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  lastName: {
    type: String,
    required: [true, "Los apellidos son necesarios"]
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Es necesario el numero de celular"]
  },
  bio: {
    type: String,
    required: [false]
  },
  points: {
    type: Number,
    required: false,
    default:0
  },
  stairs:{
    type: Number,
    required:[false],
    default: 5
  },
  numberServices:{
    type: Number,
    required:[false],
    default:0
  },
  document: {
    type: Number,
    unique: true,
    required: [true, "Es necesario el documentooo"]
  },
  birth: {
    type: Date,
    required: [true, "La edad es necesaria"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Este correo ya esta registrado"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"]
  },
  address: {
    type: String,
    required: [true, "La direccion es necesaria"]
  },
  city:{
    type: String,
    required: [true, "la ciudad es necesaria"]
  },
  urlImg:{
    type: String,
    required:[false],
    default: "sin asignar"
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "REGULAR",
    enum: rolesValidos
  },
  deviceInfo : [{
      // The current bundle build of the app
    appBuild : String,
    // The current bundle verison of the app
    appVersion : String,
    // How much free disk space is available on the the normal data storage path for the os, in bytes
    diskFree : Number,
    // The total size of the normal data storage path for the OS, in bytes
    diskTotal : Number,
    // Whether the app is running in a simulator/emulator
    isVirtual : Boolean,
    // The manufacturer of the device
    manufacturer : String,
    // Approximate memory used by the current app, in bytes. Divide by 1048576 to get the number of MBs used.
    memUsed : Number,
    // The device model. For example, "iPhone"
    model : String,
    // The operating system of the device
    operatingSystem : String,
    // The version of the device OS
    osVersion : String,
    // The device platform (lowercase).
    platform : String,
    
  }],
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
};

barber.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Barber", barber);

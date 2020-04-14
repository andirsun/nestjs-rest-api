const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
///////autoincremental id's 
//const AutoIncrement = require('mongoose-sequence')(mongoose);

let rolesValidos = {
  values: ["USER_ROLE", "USER_VIP_ROLE"],
  message: "{VALUE} no es un rol válido"
};
let Schema = mongoose.Schema;

let address = new Schema({ 
  city : String,
  address : String,
  favorite : Boolean,
  description:String,
  lat : String,
  lng : String,
});

let card = new Schema({
    id:Number,
    wompiCode :String,
    favorite : Boolean,
    type: String,
    nameCard : String,
    lastName : String,
    cardNumber : String,
    monthExpiraton : String,
    yearExpiration : String,
    last4Numbers : String,
    cvc:String,
    brand:String
  });
  let nequi = new Schema({
    id:Number,
    favorite : Boolean,
    type : String,
    phone : String,
    document:String,
    date : String,
    token : String
  });


let usuarioSchema = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  phoneToken:{
    type:String,
    default:"none"
  },
  updated: { 
    type: String,
    required:false, 
  },
  name: {
    type: String,
    required: false
  },
  registrationCode :{
    type : String,
    require: [true,"Es necesario el mismo"]
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Es necesario el numero de celular"]
  },
  birth: {
    type: Date,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  addresses : [address],
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos
  },
  numServices:{
    type : Number,
    required:false,
    default:0
  },
  points: {
    type: Number,
    required: false,
    default:0
  },
  status: {
    type: Boolean,
    default: true
  },
  cards : [card],
  nequiAccounts : [nequi],
  publicityMethod:{
    type: String,
    default: "none"
  }
});

// usuarioSchema.methods.toJSON = function() {
//   let user = this;
//   let userObject = user.toObject();
//   delete userObject.password;

//   return userObject;
// };

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });
//usuarioSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model("User", usuarioSchema);

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["USER_ROLE", "USER_VIP_ROLE"],
  message: "{VALUE} no es un rol válido"
};
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
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
  lastName: {
    type: String,
    required: false
  },
  birth: {
    type: Date,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
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
};

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("User", usuarioSchema);

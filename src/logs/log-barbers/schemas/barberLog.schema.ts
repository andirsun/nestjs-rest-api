//File use for mongodb schemas
import { Schema} from "mongoose"; 
/* Unique validator Plugin */
import uniqueValidator = require("mongoose-unique-validator");
/** Moment js Time handler module */
import * as momentZone from 'moment-timezone';

export const LogBarbersSchema = new Schema({
    time: { 
        type: String,
        required:true, 
        default: momentZone().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
    },
    category: {
        type: String,
        required: [true,"Category is neccesary"]
    },
    description: {
        type: String,
        required: [true,"Description is  neccesary"]
    },
    relatedID: {
        type: String,
        required: [true, "El id Asociado es necesario"]
    }
});
/*PLUGINS ZONE*/
// Plugin to make unique validator
LogBarbersSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });
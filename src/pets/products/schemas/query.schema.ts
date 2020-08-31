//File use for mongodb schemas
import { Schema} from "mongoose"; 
/* Unique validator Plugin */
import uniqueValidator = require("mongoose-unique-validator");
/** Moment js Time handler module */
import * as momentZone from 'moment-timezone';
import { QueryRepository} from "../interfaces/query.interface";

export const QuerySchema = new Schema<QueryRepository>({
    time: { 
        type: String,
        required:true, 
        default: momentZone().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
    },
    query: {
        type: String,
        required: [true,"la query es neccesaria"]
    }
});
/*PLUGINS ZONE*/
// Plugin to make unique validator
QuerySchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });
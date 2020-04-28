import { Injectable } from '@nestjs/common';
//Moongose Dependencies
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
//Require Interface to handle info
import { Log } from "./interfaces/logPets.interface";
@Injectable()
export class LogPetsService {

    constructor(@InjectModel('LogPets') private readonly logModel : Model<Log>){}

    


    log(message : string, relatedID : string) {
        let log = new this.logModel();
        //Create the Log structure
        log.category = "log";
        log.relatedID = relatedID;
        log.description = message;
        // MOngoose save document
        log.save()
        .then(log=>console.log("log guardado"))
        .catch(err =>console.log(`Error al guardar el log ${err}`));
        
    }
    error(message : string,relatedID : string) {
        let log = new this.logModel();
        //Create the Log structure
        log.category = "error";
        log.relatedID = relatedID;
        log.description = message;
        // MOngoose save document
        log.save()
        .then(log=>console.log("log guardado"))
        .catch(err =>console.log(`Error al guardar el log ${err}`));
    /* your implementation */
    }
    warn(message: string) {
    /* your implementation */
    }
    debug(message: string) {
    /* your implementation */
    }
    verbose(message: string) {
    /* your implementation */
    }
}

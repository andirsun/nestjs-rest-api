import { Injectable } from '@nestjs/common';
//Moongose Dependencies
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
//Require Interface to handle info
import { Log } from "./interfaces/logBarbers.interface";
/** Class to save a log for save in database */
import { CreateLogBarbersDTO } from "./dto/logBarbers.dto";

@Injectable()
export class LogBarbersService {

    constructor(@InjectModel('LogBarbers') private readonly logModel : Model<Log>){}
    
    log(message : string) {
        let log = new this.logModel();
        log.category = "log";
        log.relatedID = "este es 3el id asicieado";
        log.description = message;
        console.log(log); 
        log.save()
        .then(log=>console.log("log guardado"))
        .catch(err =>console.log(`Error al guardar el log ${err}`));
        
    }
    error(message : string) {
        let log = new this.logModel();
        log.category = "error"; 
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

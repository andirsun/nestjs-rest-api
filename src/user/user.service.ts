require("dotenv").config();
import { Twilio } from "twilio";
const twilioId = process.env.ACCOUNT_SID || "";
const twilioToken = process.env.AUTH_TOKEN || "";
const client = new Twilio(twilioId, twilioToken);
//Nest js Impor
import { Injectable } from '@nestjs/common';
//Moongose Dependencies
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
//Require Interface to handle info
import { User } from "./interfaces/user.interfaces";
//data transfer object
import { CreateUserDTO } from "./dto/user.dto";

// This file works to make queries to the databse 
@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel : Model<User>){}
    /* Auxiliarie Functions*/
    sendSMSMessage(numberDestiny : string,message : string){
        client.messages.create({
          from:'+14403974927',
          to: '+57'+numberDestiny,
          body : message
        }).then((message: { sid: any; }) => console.log(message.sid));
    }
    //The message need to have a format accord to twilio documentation
    sendWhatsAppMessage(numberDestiny :string,message:string){
        client.messages.create({
          from:'whatsapp:+14155238886',
          to: 'whatsapp:+57'+numberDestiny,
          body : message
        }).then(message => console.log(message.sid));
    }
    /* Queries*/
    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }

    async getUser(userId : string):Promise<User>{
         const user = await  this.userModel.findById(userId);
         return user;
    }

    async createUser(createUserDTO : CreateUserDTO) : Promise<User>{
        const user = new this.userModel(createUserDTO);
        console.log("object");
        return await user.save();
    }

}

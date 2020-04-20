// NEST JS injectable dependecy
import { Injectable } from '@nestjs/common';
/*Require to read .env file enviroment*/
require("dotenv").config();
/*Twilio Dependencies*/
import { Twilio } from "twilio";
/*Api keys*/
let twilioID : string = "";
let twilioToken : string = "";
if(process.env.ENVIROMENT == "local" || process.env.ENVIROMENT == "dev"){
    //Dev or local enviroment
    twilioID = process.env.TWILIO_TEST_SID || "";
    twilioToken = process.env.TWILIO_TEST_AUTH_TOKEN || "";
}else{
    //Production Mode in other case
    twilioID = process.env.TWILIO_PRODUCTION_SID || "";
    twilioToken = process.env.TWILIO_PRODUCTION_AUTH_TOKEN || "";
}
/*Client to use twilio api functions*/ 
const client = new Twilio(twilioID, twilioToken);

@Injectable()
export class TwilioService {
    /* Auxiliarie Functions*/
    sendSMSMessage(numberDestiny : number,message : string, countryCode : number){
        client.messages.create({
          from:'+14403974927',
          to: `+${countryCode}${numberDestiny}`,
          body : message
        })
        .then((message: { sid: any; }) => console.log(`SMS message: ${message} to number: ${numberDestiny} ${message.sid}`))
        .catch((err)=>console.log(err));
    }
    //The message need to have a format accord to twilio documentation ask to admin for more info about formats
    sendWhatsAppMessage(numberDestiny :number,message:string,countryCode : number){
        client.messages.create({
          from:'whatsapp:+14155238886',
          to:`whatsapp:+${countryCode}${numberDestiny}`,
          body : message
        })
        .then(message => console.log(`WhatsApp message: ${message} to number: ${numberDestiny} ${message.sid}`))
        .catch(err => console.log(err));
    }
}

import { Module } from '@nestjs/common';
import { LogBarbersService } from './log-barbers.service';
import { MongooseModule } from "@nestjs/mongoose";
import { LogBarbersSchema } from "./schemas/barberLog.schema";

@Module({
  imports :[
    MongooseModule.forFeature(
       /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [
        //If we need more schemas for user module can import here
        {name:"LogBarbers",schema : LogBarbersSchema}

      ],'BarbersMongoDb')
  ],
  providers: [LogBarbersService],
  exports :[LogBarbersService]
})
export class LogBarbersModule {}

import { Module } from '@nestjs/common';
import { LogBarbersService } from './log-barbers.service';
import { MongooseModule } from "@nestjs/mongoose";
import { LogBarbersSchema } from "./schemas/barberLog.schema";

@Module({
  imports :[
    MongooseModule.forFeature([
      //If we need more schemas for user module can import here
      {name:"LogBarbers",schema : LogBarbersSchema}
    ])
  ],
  providers: [LogBarbersService],
  exports :[LogBarbersService]
})
export class LogBarbersModule {}

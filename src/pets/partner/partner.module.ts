/* Nest js Dependencies */
import { Module } from '@nestjs/common';
/* Services */
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
/* Schemas */
import { PartnerSchema } from "./schemas/partner.schema";
/* Extra modules importations */
import { MongooseModule } from "@nestjs/mongoose";
import { LogPetsModule } from '../log-pets/log-pets.module';
import { TwilioModule } from 'src/modules/twilio/twilio.module';
import { PassportModule } from "@nestjs/passport";
@Module({
  imports: [
    MongooseModule.forFeature(
       /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [
        //If we need more schemas for user module can import here
        {name:"Partner",schema : PartnerSchema}
      ],'PetsMongoDb'),
    // Other module is required need to import here
    LogPetsModule,
    TwilioModule,
    PassportModule.register({
      defaultStrategy :'jwt',
      session:false
    }),
    
  ],
  providers: [PartnerService],
  controllers: [PartnerController],
  exports : [PartnerService]
})
export class PartnerModule {}

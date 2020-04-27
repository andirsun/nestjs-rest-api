/*Nest Js imports */
import { Module } from '@nestjs/common';
/* User Modules imports*/
import { UserController } from './user.controller';
import { UserService } from './user.service';
/* Schemas */
import { UserSchema } from "./schemas/user.schema";
/* Extra modules importations */
import { MongooseModule } from "@nestjs/mongoose";
import { LogBarbersModule } from 'src/barbers/log-barbers/log-barbers.module';


@Module({
  imports: [
    MongooseModule.forFeature(
      /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [ 
        //If we need more schemas for user module can import here
        {name:"User",schema : UserSchema}
        
      ],'BarbersMongoDb'),
    // Other module is required need to import here
    LogBarbersModule
    
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

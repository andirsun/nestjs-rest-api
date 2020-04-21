/*Nest Js imports */
import { Module } from '@nestjs/common';
/* User Modules imports*/
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from "./schemas/user.schema";
/* Extra modules importations */
import { MongooseModule } from "@nestjs/mongoose";
import { LogBarbersModule } from 'src/logs/log-barbers/log-barbers.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      //If we need more schemas for user module can import here
      {name:"User",schema : UserSchema}
    ]),
    // Other module is required need to import here
    LogBarbersModule
    
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

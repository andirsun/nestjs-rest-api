/*Nest Js imports */
import { Module } from '@nestjs/common';
/* User Modules imports*/
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      //If we need more schemas for user module can import here
      {name:"User",schema : UserSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

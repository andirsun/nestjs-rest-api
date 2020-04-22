/*Nest Js imports */
import { Module } from '@nestjs/common';
/* User Modules imports*/
import { UserPetsController } from './user-pets.controller';
import { UserPetsSchema } from "./schemas/user-pets.schema";
import { UserPetsService } from './user-pets.service';
/* Extra modules importations */
import { MongooseModule } from "@nestjs/mongoose";
import { LogPetsModule } from 'src/logs/log-pets/log-pets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      //If we need more schemas for user module can import here
      {name:"UserPets",schema : UserPetsSchema}
    ]),
    // Other module is required need to import here
    LogPetsModule
    
  ],
  providers: [UserPetsService],
  controllers: [UserPetsController]
})
export class UserPetsModule {}

import { Module } from '@nestjs/common';
import { LogPetsService } from './log-pets.service';
import { MongooseModule } from "@nestjs/mongoose";
import { LogPetsSchema } from './schemas/logPets.schema';

@Module({
  imports:[
    MongooseModule.forFeature(
      /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [
        //If we need more schemas for user module can import here
        {name:"LogPets",schema : LogPetsSchema}
      
      ],'PetsMongoDb')
  ],
  providers: [LogPetsService],
  exports:[LogPetsService]
})
export class LogPetsModule {}

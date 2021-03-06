/*Nest Js imports */
import { Module } from '@nestjs/common';
/* User Modules imports*/
import { UserPetsController } from './user-pets.controller';
import { UserPetsSchema } from "./schemas/user-pets.schema";
import { UserPetsService } from './user-pets.service';
/* Extra modules importations */
import { MongooseModule } from "@nestjs/mongoose";
import { LogPetsModule } from 'src/pets/log-pets/log-pets.module';
import { ProductsModule } from '../products/products.module';
import { PartnerModule } from '../partner/partner.module';
import { OrdersPetsModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [
        //If we need more schemas for user module can import here
        {name:"UserPets",schema : UserPetsSchema}
        
      ],'PetsMongoDb'),
      // Other module is required need to import here
      LogPetsModule,
      ProductsModule,
      PartnerModule,
  ],
  providers: [UserPetsService],
  controllers: [UserPetsController],
  exports :[UserPetsService]
})
export class UserPetsModule {}

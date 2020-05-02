/* Nest Js Dependencies */
import { Module } from '@nestjs/common';
/* Mongoose dependencies */
import { MongooseModule } from '@nestjs/mongoose';
/* Services */
import { ProductsService } from './products.service';
/* Controllers */
import { ProductsController } from './products.controller';
/* Schemas */
import { ProductSchema } from './schemas/product.schema';
/* Modules */
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    MongooseModule.forFeature(
      /*
       Fist paremeter : array with the schemas to save in the database
       the second parameter : name database 
     */
     [
       //If we need more schemas for user module can import here
       {name:"Products",schema : ProductSchema}

     ],'PetsMongoDb'),
     /* Defines de Auth Method to use in this module */
     PassportModule.register({
      defaultStrategy :'jwt',
      session:false
    }),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports:[ProductsService]
})
export class ProductsModule {}

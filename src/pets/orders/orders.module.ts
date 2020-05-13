import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderPetsSchema } from './schemas/order.schema';
import { LogPetsModule } from '../log-pets/log-pets.module';
import { UserPetsModule } from '../user-pets/user-pets.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports:[
    MongooseModule.forFeature(
      /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [ 
        //If we need more schemas for user module can import here
        {name:"orders",schema : OrderPetsSchema}
        
      ],'PetsMongoDb'),
    // Other module is required need to import here
    LogPetsModule,
    UserPetsModule,
    ProductsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports : [OrdersService]
})
export class OrdersPetsModule {}

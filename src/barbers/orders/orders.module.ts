import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [ 
        //If we need more schemas for user module can import here
        {name:"temporalorders",schema : orderSchema}
        
      ],'BarbersMongoDb'),
    // Other module is required need to import here
    UserModule
    
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports : [OrdersService]
})
export class OrdersBarbersModule {}

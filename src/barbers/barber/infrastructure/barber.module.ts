/* Nest Js dependencies */
import { Module } from '@nestjs/common';
/* Services */
import { BarberService } from '../application/barber.service';
/* Controllers */
import { BarberController } from './barber.controller';
/* MOngoose dependencies */
import { MongooseModule } from '@nestjs/mongoose';
/* Aditinal Schemas */
import { BarberSchema } from './schemas/barber.schema';
/* Aditional Modules */
import { LogBarbersModule } from '../../log-barbers/infrastructure/log-barbers.module';
import { OrdersBarbersModule } from '../../orders/infrastructure/orders.module';
import { FilesModule } from '../../../modules/files/infrastructure/files.module';
import { UserModule } from '../../user/infrastructure/user.module';
import { TimeModule } from '../../../modules/time/infrastructure/time.module';


@Module({
  imports : [
    MongooseModule.forFeature(
      /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [ 
        //If we need more schemas for user module can import here
        {name:"barbers",schema : BarberSchema}
        
      ],'BarbersMongoDb'),
    // Other module is required need to import here
    LogBarbersModule,
    OrdersBarbersModule,
    FilesModule,
    UserModule,
    TimeModule
  ],
  providers: [BarberService],
  controllers: [BarberController],
  exports : [BarberService]
})
export class BarberModule {}

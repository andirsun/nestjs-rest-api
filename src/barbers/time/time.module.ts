import { Module } from "@nestjs/common";
import { TimeService } from "./time.service";
import { MongooseModule } from '@nestjs/mongoose';
import { BarberSchema } from '../barber/schemas/barber.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'orders', schema: BarberSchema}
    ], 'BarbersMongoDb')
  ],
  providers: [TimeService],
  exports: [TimeService]
})

export class TimeModule{}
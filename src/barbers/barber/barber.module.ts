import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';

@Module({
  providers: [BarberService],
  controllers: [BarberController]
})
export class BarberModule {}

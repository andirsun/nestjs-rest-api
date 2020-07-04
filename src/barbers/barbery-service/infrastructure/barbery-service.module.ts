import { Module } from '@nestjs/common';
import { BarberyServiceService } from '../application/barbery-service.service';

@Module({
  providers: [BarberyServiceService]
})
export class BarberyServiceModule {}

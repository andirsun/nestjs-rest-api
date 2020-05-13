import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  exports:[ServiceService]
})
export class ServiceModule {}

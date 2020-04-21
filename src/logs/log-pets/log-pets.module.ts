import { Module } from '@nestjs/common';
import { LogPetsService } from './log-pets.service';

@Module({
  providers: [LogPetsService]
})
export class LogPetsModule {}

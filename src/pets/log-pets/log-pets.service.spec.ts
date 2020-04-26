import { Test, TestingModule } from '@nestjs/testing';
import { LogPetsService } from './log-pets.service';

describe('LogPetsService', () => {
  let service: LogPetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogPetsService],
    }).compile();

    service = module.get<LogPetsService>(LogPetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LogBarbersService } from './log-barbers.service';

describe('LogBarbersService', () => {
  let service: LogBarbersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogBarbersService],
    }).compile();

    service = module.get<LogBarbersService>(LogBarbersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BarberyServiceService } from '../application/barbery-service.service';

describe('BarberyServiceService', () => {
  let service: BarberyServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarberyServiceService],
    }).compile();

    service = module.get<BarberyServiceService>(BarberyServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

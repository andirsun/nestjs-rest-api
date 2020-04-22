import { Test, TestingModule } from '@nestjs/testing';
import { UserPetsService } from './user-pets.service';

describe('UserPetsService', () => {
  let service: UserPetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPetsService],
    }).compile();

    service = module.get<UserPetsService>(UserPetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

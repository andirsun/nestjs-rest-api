import { Test, TestingModule } from '@nestjs/testing';
import { UserPetsController } from './user-pets.controller';

describe('UserPets Controller', () => {
  let controller: UserPetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPetsController],
    }).compile();

    controller = module.get<UserPetsController>(UserPetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

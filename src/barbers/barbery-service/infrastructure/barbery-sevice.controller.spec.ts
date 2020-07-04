import { Test, TestingModule } from '@nestjs/testing';
import { BarberySeviceController } from './barbery-sevice.controller';

describe('BarberySevice Controller', () => {
  let controller: BarberySeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarberySeviceController],
    }).compile();

    controller = module.get<BarberySeviceController>(BarberySeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

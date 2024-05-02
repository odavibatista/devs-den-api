import { Test, TestingModule } from '@nestjs/testing';
import { UfController } from './uf.controller';

describe('UfController', () => {
  let controller: UfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UfController],
    }).compile();

    controller = module.get<UfController>(UfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

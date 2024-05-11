import { Test, TestingModule } from '@nestjs/testing';
import { ConjunctJobsController } from './job.controller';

describe('ControllerController', () => {
  let controller: ConjunctJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConjunctJobsController],
    }).compile();

    controller = module.get<ConjunctJobsController>(ConjunctJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

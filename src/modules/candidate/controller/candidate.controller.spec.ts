import { Test, TestingModule } from '@nestjs/testing';
import { CandidateController } from './candidate.controller';

describe('ControllerController', () => {
  let controller: CandidateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateController],
    }).compile();

    controller = module.get<CandidateController>(CandidateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

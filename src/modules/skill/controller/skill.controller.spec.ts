import { Test, TestingModule } from '@nestjs/testing';
import { IndividualSkillController, ConjunctSkillController } from './skill.controller';

describe('SkillController', () => {
  let iController: IndividualSkillController;
  let cController: ConjunctSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndividualSkillController, ConjunctSkillController],
    }).compile();

    iController = module.get<IndividualSkillController>(IndividualSkillController);
    cController = module.get<ConjunctSkillController>(ConjunctSkillController);
  });

  it('should be defined', () => {
    expect(iController).toBeDefined();
    expect(cController).toBeDefined();
  });
});

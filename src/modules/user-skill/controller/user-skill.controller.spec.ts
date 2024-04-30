import { Test, TestingModule } from '@nestjs/testing';
import { UserSkillController } from './user-skill.controller';

describe('UserSkillController', () => {
  let controller: UserSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSkillController],
    }).compile();

    controller = module.get<UserSkillController>(UserSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

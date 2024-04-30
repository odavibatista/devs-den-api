import { Skill } from './skill.entity';

describe('Entity', () => {
  it('should be defined', () => {
    expect(new Skill()).toBeDefined();
  });
});

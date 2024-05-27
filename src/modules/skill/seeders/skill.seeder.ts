import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Skill } from '../entity/skill.entity';
import skills from './skill.sample';

export default class SkillSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Skill);
    // ---------------------------------------------------

    const newSkill = await repository.create(skills);
    await repository.save(newSkill);
  }
}

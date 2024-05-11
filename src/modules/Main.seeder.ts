import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';
import UfSeeder from './uf/seeders/uf.seeder';
import SkillSeeder from './skill/seeders/skill.seeder';
import JobCategorySeeder from './job-category/seeders/job-category.seeder';
import UserSeeder from './user/seeders/user-seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, UfSeeder);

    await runSeeder(dataSource, SkillSeeder);

    await runSeeder(dataSource, JobCategorySeeder);

    await runSeeder(dataSource, UserSeeder);
  }
}

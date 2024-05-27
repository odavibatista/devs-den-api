import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { JobCategory } from '../entity/job-category.entity';
import jobCategories from './job-category.sample';

export default class JobCategorySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(JobCategory);
    // ---------------------------------------------------

    const newJobCategories = await repository.create(jobCategories);
    await repository.save(newJobCategories);
  }
}

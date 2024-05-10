import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { JobCategory } from '../entity/job-category.entity';

export default class JobCategorySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(JobCategory);
    const jobCategories = [
      {
        name: 'Front-end',
        image_url: 'https://i.imgur.com/a2FQ9F6.png'
      },
      {
        name: 'Back-end',
        image_url: 'https://i.imgur.com/462x9OZ.png'
      },
      {
        name: 'Full-stack',
        image_url: 'https://i.imgur.com/QPOHLGX.png'
      },
      {
        name: 'DevOps',
        image_url: 'https://i.imgur.com/KRz7nkj.png'
      },
      {
        name: 'Mobile',
        image_url: 'https://i.imgur.com/dVP5a6E.png'
      },
      {
        name: 'UI/UX',
        image_url: 'https://i.imgur.com/T2T0BG0.png'
      },
      {
        name: 'QA',
        image_url: 'https://i.imgur.com/b3ykh2k.png'
      },
      {
        name: 'Testers',
        image_url: 'https://i.imgur.com/2IoUOot.png'
      },
    ];
    // ---------------------------------------------------

    const newJobCategories = await repository.create(jobCategories);
    await repository.save(newJobCategories);
  }
}

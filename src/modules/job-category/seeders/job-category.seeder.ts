import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { JobCategory } from '../entity/job-category.entity';


export default class JobCategorySeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository =  dataSource.getRepository(JobCategory);
        const jobCategories = [
            {
                name: 'Front-end'
            },
            {
                name: 'Back-end'
            },
            {
                name: 'Full-stack'
            }
        ]
        // ---------------------------------------------------

        const newJobCategories = await repository.create(jobCategories)
        await repository.save(newJobCategories)
    }
}
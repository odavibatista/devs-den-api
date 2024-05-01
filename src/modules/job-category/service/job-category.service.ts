import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCategory } from '../entity/job-category.entity';
import { Repository } from 'typeorm';
import { CategoryNotFoundException } from '../domain/errors/CategoryNotFound.exception';

@Injectable()
export class JobCategoryService {
    constructor(
        @InjectRepository(JobCategory)
        private jobCategoryRepository: Repository<JobCategory>,
    )   {}

    async findAll (): Promise<JobCategory[] | CategoryNotFoundException>  {
        const jobCategories =  await this.jobCategoryRepository.find()

        if(jobCategories.length === 0) throw new CategoryNotFoundException()

        else return jobCategories
    }

    async findOne (id: number): Promise<JobCategory | CategoryNotFoundException>  {
        const jobCategory = await this.jobCategoryRepository.findOne({
            where: { id_category: id}
        })

        if (!jobCategory) throw new CategoryNotFoundException()

        else return jobCategory
    }
}
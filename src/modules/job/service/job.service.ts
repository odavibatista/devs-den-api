import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entity/job.entity';
import { Repository } from 'typeorm';
import { JobNotFoundException } from '../domain/errors/JobNotFound.exception';
import { CategoryNotFoundException } from 'src/modules/job-category/domain/errors/CategoryNotFound.exception';
import { JobCategory } from 'src/modules/job-category/entity/job-category.entity';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(Job)
        private jobRepository: Repository<Job>,
        @InjectRepository(JobCategory)
        private jobCategoryRepository: Repository<JobCategory>
    )   {}

    async findAll (): Promise<Job[] | JobNotFoundException> {
        const jobs = await this.jobRepository.find()

        if (jobs.length === 0) throw new JobNotFoundException()

        else return jobs
    }

    async findOne (id: number): Promise<Job | JobNotFoundException>   {
        const job = await this.jobRepository.findOne({
            where: { id_job: id}
        })

        if (!job) throw new JobNotFoundException()

        else return job
    }

    async findJobsByJobCategory (categoryId: number): Promise<Job[] | JobNotFoundException | CategoryNotFoundException>   {
        const category = await this.jobCategoryRepository.findOne({
            where: { id_category: categoryId }
        })

        if (!category) throw new CategoryNotFoundException()

        const jobsOfGivenCategory = await this.jobRepository.find({
            where: { job_category_id: categoryId}
        })

        if (!jobsOfGivenCategory) throw new JobNotFoundException

        else return jobsOfGivenCategory
    }

    async findJobsByModality (modality: "presential" | "hybrid" | "remote"): Promise<Job[] | JobNotFoundException>  {        
        const jobsByGivenModality = await this.jobRepository.find({
            where:  { modality: modality }
        })

        if (jobsByGivenModality.length === 0) throw new JobNotFoundException()

        else return jobsByGivenModality
    }
}
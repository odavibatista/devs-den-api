import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entity/job.entity';
import { Repository } from 'typeorm';
import { JobNotFoundException } from '../domain/errors/JobNotFound.exception';
import { CategoryNotFoundException } from 'src/modules/job-category/domain/errors/CategoryNotFound.exception';
import { JobCategory } from 'src/modules/job-category/entity/job-category.entity';
import { Company } from 'src/modules/company/entity/company.entity';
import { CompanyNotFoundException } from 'src/modules/company/domain/errors/CompanyNotFound.exception';
import { InvalidModalityException } from '../domain/errors/InvalidModality.exception';
import { CreateJobBodyDTO, CreateJobResponseDTO } from '../domain/requests/CreateJob.request.dto';
import { FindJobResponseDTO } from '../domain/requests/FindJobs.request.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobCategory)
    private jobCategoryRepository: Repository<JobCategory>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>
  ) {}

  async findAll(): Promise<Job[]> {
    const jobs = await this.jobRepository.find();

    jobs.filter((job) => job.deleted_at == null)

    return jobs
  }

  async findOne(id: number): Promise<FindJobResponseDTO | JobNotFoundException> {
    const job = await this.jobRepository.findOne({
      where: { id_job: id },
    });

    if (!job) throw new JobNotFoundException()

    const jobCompany = await this.companyRepository.findOne({
      where: { id_user: job.company_id }
    })

    if (!jobCompany) throw new CompanyNotFoundException()


    const jobCategory = await this.jobCategoryRepository.findOne({
      where: { id_category: job.job_category_id }
    })

    if (!jobCategory) throw new CategoryNotFoundException()

    return {
      job: {
        id_job: job.id_job,
        title: job.title,
        description: job.description,
        wage: job.wage,
        modality: job.modality,
        contract: job.contract,

        job_category: {
          id_category: jobCategory.id_category,
          name: jobCategory.name,
          image_url: jobCategory.image_url
        }
      },

      company:  {
        id_company: jobCompany.id_user,
        name: jobCompany.name,
      }
    }
  }

  async findJobsByJobCategory(
    categoryId: number,
  ): Promise<Job[] | JobNotFoundException | CategoryNotFoundException> {
    const category = await this.jobCategoryRepository.findOne({
      where: { id_category: categoryId },
    });

    if (!category) throw new CategoryNotFoundException();

    const jobsOfGivenCategory = await this.jobRepository.find({
      where: { job_category_id: categoryId },
    });

    if (!jobsOfGivenCategory) throw new JobNotFoundException();
    else return jobsOfGivenCategory;
  }

  async findJobsByModality(
    modality: 'presential' | 'hybrid' | 'remote',
  ): Promise<Job[] | JobNotFoundException> {
    const jobsByGivenModality = await this.jobRepository.find({
      where: { modality: modality },
    });

    if (jobsByGivenModality.length === 0) throw new JobNotFoundException();
    else return jobsByGivenModality;
  }

  async createJob (params: CreateJobBodyDTO, companyId: number): Promise<CreateJobResponseDTO | CompanyNotFoundException | InvalidModalityException | CategoryNotFoundException> {
    
    const jobCompany = await this.companyRepository.findOne({
      where: { id_user: companyId }
    })

    if (!jobCompany || jobCompany.deleted_at !== null) throw new CompanyNotFoundException()

    const jobCategory = await this.jobCategoryRepository.findOne({
      where: { id_category: params.job_category_id }
    })

    if (!jobCategory) throw new CategoryNotFoundException()

    const job = await this.jobRepository.save({
      title: params.title,
      description: params.description,
      company_id: companyId,
      job_category_id: params.job_category_id,
      wage: params.wage,
      modality: params.modality,
    })

    const response = {
      id: job.id_job,
      title: job.title,
      description: job.description,
      company_id: job.company_id,
      job_category_id: job.job_category_id,
      wage: job.wage,
      modality: job.modality,
    }

    return response
  }
}

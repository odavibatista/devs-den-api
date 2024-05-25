import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entity/job.entity';
import { Repository } from 'typeorm';
import { JobNotFoundException } from '../domain/errors/JobNotFound.exception';
import { CategoryNotFoundException } from '../../../modules/job-category/domain/errors/CategoryNotFound.exception';
import { JobCategory } from '../../../modules/job-category/entity/job-category.entity';
import { Company } from '../../../modules/company/entity/company.entity';
import { CompanyNotFoundException } from '../../../modules/company/domain/errors/CompanyNotFound.exception';
import { InvalidModalityException } from '../domain/errors/InvalidModality.exception';
import { CreateJobBodyDTO, CreateJobResponseDTO } from '../domain/requests/CreateJob.request.dto';
import { FindJobResponseDTO, SimpleFindJobResponseDTO } from '../domain/requests/FindJobs.request.dto';
import { JobApplicationService } from 'src/modules/job-applications/service/job-application.service';
import { GetJobStatusResponseDTO } from '../domain/requests/GetJobStatus.request.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobCategory)
    private jobCategoryRepository: Repository<JobCategory>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jobApplicationService: JobApplicationService
  ) {}

  async findAll(): Promise<SimpleFindJobResponseDTO[]> {
    const jobs = await this.jobRepository.find();

    const filteredJobs = jobs.filter((job) => job.deleted_at === null).map((job) => {
      return {
        id_job: job.id_job,
        title: job.title,
        description: job.description,
        wage: job.wage,
        modality: job.modality,
        contract: job.contract,
        job_category: job.job_category_id,
        company_id: job.company_id,
        created_at: job.created_at,
        updated_at: job.updated_at,
    }}
  )

    return filteredJobs
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

  async getJobStatus (jobId: number, companyId: number): Promise<GetJobStatusResponseDTO | JobNotFoundException> {
    const job = await this.jobRepository.findOne({
      where: { id_job: jobId }
    })

    if (job.company_id !== companyId) throw new UnauthorizedException()

    if (!job) throw new JobNotFoundException()

    const jobCategory = await this.jobCategoryRepository.findOne({
      where: { id_category: job.job_category_id }
    })

    if (!jobCategory) throw new CategoryNotFoundException()

    const applications = await this.jobApplicationService.getJobApplications(jobId)

    if (applications instanceof Array) {
      applications.map((application) => {
        return {
          id_user: application.candidate_id,
          job_id: application.job_id,
          active: application.active
        }
      })

      return {
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
        },
        applications: applications
      }
    }

  }
  
  async deleteJob (jobId: number, companyId: number): Promise<void | JobNotFoundException> {
    const job = await this.jobRepository.findOne({
      where: { id_job: jobId }
    })

    if (!job) throw new JobNotFoundException()

    if (job.company_id !== companyId) throw new UnauthorizedException()

    job.deleted_at = String(new Date())
    
    await this.jobRepository.update(jobId, job)
  }
}

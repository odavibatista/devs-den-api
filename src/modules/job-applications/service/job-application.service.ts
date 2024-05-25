import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../../job/entity/job.entity';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { ApplyToJobDTO } from '../../job/domain/requests/ApplyToJob.request.dto';
import { AlreadyAppliedToJobException } from '../../job/domain/errors/AlreadyAppliedToJob.exception';
import { UserIsNotCandidateException } from '../../job/domain/errors/UserIsNotCandidate.exception';
import { JobHasBeenExpiredException } from '../../job/domain/errors/JobHasBeenExpired.exception';
import { JobNotFoundException } from '../../job/domain/errors/JobNotFound.exception';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';
import { JobApplication } from '../entity/job-application.entity';
import { UserIsNotCompanyException } from 'src/modules/job/domain/errors/UserIsNotCompany.exception';
import { BadTokenException } from 'src/modules/user/domain/errors/BadToken.exception';

@Injectable()
export class JobApplicationService {
    constructor(
        @InjectRepository(JobApplication)
        private jobApplicationReopository: Repository<JobApplication>,
        @InjectRepository(Job)
        private jobRepository: Repository<Job>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async applyToJob (params: ApplyToJobDTO): Promise<void | AlreadyAppliedToJobException | UserIsNotCandidateException | JobHasBeenExpiredException | JobNotFoundException | UserNotFoundException> {
    
        const user = await this.userRepository.findOne({
          where: { id_user: params.candidate_id }
        })
    
        if (user.deleted_at !== null) throw new UserNotFoundException()
    
        if (user.role !== 'candidate') throw new UserIsNotCandidateException()
    
    
        const job = await this.jobRepository.findOne({
          where: { id_job: params.job_id },
        });

        if (!job || job.deleted_at !== null) throw new JobNotFoundException()

        const alreadyAppliedToJob = await this.jobApplicationReopository.findOne({
            where: { candidate_id: params.candidate_id, job_id: params.job_id }
        })

        if (!alreadyAppliedToJob) {
          await this.jobApplicationReopository.save({
            candidate_id: params.candidate_id,
            job_id: params.job_id
          })
        } 
        
        else if (alreadyAppliedToJob.active === true) throw new AlreadyAppliedToJobException() 
        
        else if (alreadyAppliedToJob.active === false) {
            await this.jobApplicationReopository.update({
                candidate_id: params.candidate_id,
                job_id: params.job_id
            },
            {
                active: true
            })
        } 

        return
      }

      async getJobApplications (job_id: number): Promise<JobApplication[] | UnauthorizedException | BadTokenException> {
        const job = await this.jobRepository.findOne({
          where: { id_job: job_id }
        })

        if (!job) throw new JobNotFoundException()

        const applications = await this.jobApplicationReopository.find({
          where: { job_id: job_id }
        })

        return applications
      }
}

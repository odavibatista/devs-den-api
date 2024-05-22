import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../job/entity/job.entity';
import { Repository } from 'typeorm';
import { Company } from '../company/entity/company.entity';
import { User } from '../user/entity/user.entity';
import { ApplyToJobDTO } from '../job/domain/requests/ApplyToJob.request.dto';
import { AlreadyAppliedToJobException } from '../job/domain/errors/AlreadyAppliedToJob.exception';
import { UserIsNotCandidateException } from '../job/domain/errors/UserIsNotCandidate.exception';
import { JobHasBeenExpiredException } from '../job/domain/errors/JobHasBeenExpired.exception';
import { JobNotFoundException } from '../job/domain/errors/JobNotFound.exception';
import { UserNotFoundException } from '../user/domain/errors/UserNotFound.exception';

@Injectable()
export class JobApplicationService {
    constructor(
        @InjectRepository(Job)
        private jobRepository: Repository<Job>,
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async applyToJob (params: ApplyToJobDTO): Promise<any | AlreadyAppliedToJobException | UserIsNotCandidateException | JobHasBeenExpiredException | JobNotFoundException | UserNotFoundException> {
    
        const user = await this.userRepository.findOne({
          where: { id_user: params.candidate_id }
        })
    
        if (user.deleted_at !== null) throw new UserNotFoundException()
    
        if (user.role !== 'candidate') throw new UserIsNotCandidateException()
    
    
        const job = await this.jobRepository.findOne({
          where: { id_job: params.job_id },
        });
      }
}

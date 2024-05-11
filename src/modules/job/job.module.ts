import { Module } from '@nestjs/common';
import { JobService } from './service/job.service';
import { ConjunctJobsController, IndividualJobController } from './controller/job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { JobCategory } from '../job-category/entity/job-category.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Skill } from '../skill/entity/skill.entity';
import { Company } from '../company/entity/company.entity';

@Module({
  imports: [
    DatabaseModule,
    JobModule,
    TypeOrmModule.forFeature([Job, JobCategory, Skill, Company]),
  ],

  providers: [JobService, JobCategory],

  controllers: [ConjunctJobsController, IndividualJobController],
})
export class JobModule {}

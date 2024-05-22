import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { DatabaseModule } from 'src/database/database.module';
import { JobModule } from '../job/job.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../job/entity/job.entity';
import { Company } from '../company/entity/company.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    JobModule,
    TypeOrmModule.forFeature([Job, Company, User]),
  ],
  providers: [JobApplicationService]
})
export class JobApplicationModule {}

import { Module } from '@nestjs/common';
import { JobApplicationService } from './service/job-application.service';
import { DatabaseModule } from 'src/database/database.module';
import { JobModule } from '../job/job.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../job/entity/job.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    JobModule,
    TypeOrmModule.forFeature([Job, User]),
  ],
  providers: [JobApplicationService],
})

export class JobApplicationModule {}

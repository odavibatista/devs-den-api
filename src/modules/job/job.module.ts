import { Module } from '@nestjs/common';
import { JobService } from './service/job.service';
import { JobController } from './controller/job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { JobCategory } from '../job-category/entity/job-category.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    JobModule,
    TypeOrmModule.forFeature([Job, JobCategory]),
  ],

  providers: [JobService, JobCategory],
    
  controllers: [JobController]
})
export class JobModule {}
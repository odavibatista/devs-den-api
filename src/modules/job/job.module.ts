import { Module } from '@nestjs/common';
import { JobService } from './service/job.service';
import { JobController } from './controller/job.controller';

@Module({
    

  providers: [JobService],
    

  controllers: [JobController]
})
export class JobModule {}

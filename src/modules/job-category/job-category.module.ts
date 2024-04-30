import { Module } from '@nestjs/common';
import { JobCategoryController } from './controller/job-category.controller';
import { JobCategoryService } from './service/job-category.service';

@Module({
  controllers: [JobCategoryController],
  providers: [JobCategoryService]
})
export class JobCategoryModule {}

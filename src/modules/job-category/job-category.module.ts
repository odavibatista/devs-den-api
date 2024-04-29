import { Module } from '@nestjs/common';
import { ControllerController } from './controller/controller.controller';
import { JobcategoryController } from './controller/jobcategory/jobcategory.controller';
import { ControllerController } from './controller.controller';
import { JobCategoryController } from './controller/job-category.controller';
import { JobCategoryService } from './service/job-category.service';

@Module({
  controllers: [ControllerController, JobcategoryController, JobCategoryController],
  providers: [JobCategoryService]
})
export class JobCategoryModule {}

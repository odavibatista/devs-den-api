import { Module } from '@nestjs/common';
import { JobCategoryController } from './controller/job-category.controller';
import { JobCategoryService } from './service/job-category.service';
import { CategoryNotFoundException } from './domain/errors/CategoryNotFound.exception';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from './entity/job-category';
import { Job } from '../job/entity/job.entity';

@Module({
  imports: [
    CategoryNotFoundException,
    JobCategoryModule,
    TypeOrmModule.forFeature([JobCategory]),
  ],
  controllers: [JobCategoryController],
  providers: [JobCategoryService]
})
export class JobCategoryModule {}

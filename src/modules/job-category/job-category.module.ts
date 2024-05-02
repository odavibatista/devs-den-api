import { Module } from '@nestjs/common';
import { JobCategoryController } from './controller/job-category.controller';
import { JobCategoryService } from './service/job-category.service';
import { CategoryNotFoundException } from './domain/errors/CategoryNotFound.exception';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from './entity/job-category.entity';
import { Job } from '../job/entity/job.entity';
import { Skill } from '../skill/entity/skill.entity';

@Module({
  imports: [
    CategoryNotFoundException,
    JobCategoryModule,
    TypeOrmModule.forFeature([JobCategory, Job, Skill]),
  ],
  controllers: [JobCategoryController],
  providers: [JobCategoryService],
})
export class JobCategoryModule {}

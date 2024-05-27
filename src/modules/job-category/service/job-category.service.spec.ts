import { Test, TestingModule } from '@nestjs/testing';
import { JobCategoryService } from './job-category.service';
import { CategoryNotFoundException } from '../domain/errors/CategoryNotFound.exception';
import { JobCategoryModule } from '../job-category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from '../entity/job-category.entity';
import { Job } from '../../../modules/job/entity/job.entity';
import { Skill } from '../../../modules/skill/entity/skill.entity';

describe('JobCategoryService', () => {
  let jobCategoryService: JobCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CategoryNotFoundException,
        JobCategoryModule,
        TypeOrmModule.forFeature([JobCategory, Job, Skill]),
      ],
      providers: [JobCategoryService],
    }).compile();

    jobCategoryService = module.get<JobCategoryService>(JobCategoryService);
  });

  it('should bring all the skills from the database', async () => {
    const request = await jobCategoryService.findAll()

    expect(request).toBeInstanceOf(Array)

    expect(typeof request[0].id_category).toEqual("number")
    expect(typeof request[0].name).toEqual("string")
    expect(typeof request[0].image_url).toEqual("string")
  });
});

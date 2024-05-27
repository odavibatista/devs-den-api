import { Test, TestingModule } from '@nestjs/testing';
import { JobCategoryService } from './job-category.service';
import { CategoryNotFoundException } from '../domain/errors/CategoryNotFound.exception';
import { JobCategoryModule } from '../job-category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from '../entity/job-category.entity';
import { Job } from '../../../modules/job/entity/job.entity';
import { Skill } from '../../../modules/skill/entity/skill.entity';
import { FindJobCategoryResponseDTO } from '../domain/requests/FindJobCategories.request.dto';

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

    expect(request[0]).toHaveProperty("id_category")  
    expect(typeof request[0].id_category).toEqual("number")
    expect(request[0]).toHaveProperty("name")  
    expect(typeof request[0].name).toEqual("string")
    expect(request[0]).toHaveProperty("image_url")  
    expect(typeof request[0].image_url).toEqual("string")
  });

  it('should contain 8 job categories in total if the database has been previously seeded', async () =>  {
    const request = await jobCategoryService.findAll()

    expect(request).toHaveLength(8)
  })

  it('should bring a single job category from the database', async ()  =>  {
    const basalRequest = await jobCategoryService.findAll()

    const request: FindJobCategoryResponseDTO = await jobCategoryService.findOne(basalRequest[0].id_category)

    expect(request).toHaveProperty('id_category')
    expect(typeof request.id_category).toEqual("number")
    expect(request).toHaveProperty('name')
    expect(typeof request.name).toEqual("string")
    expect(request).toHaveProperty('image_url')
    expect(typeof request.image_url).toEqual("string")
  })

  it('should throw an error if an unvalid number is passed on the individual job category finder', async ()  =>  {
    expect(async () => {
      await jobCategoryService.findOne(11111111111111111111111111999999999999)
    }).rejects.toThrow(CategoryNotFoundException);
  })
});

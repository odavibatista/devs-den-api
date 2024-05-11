import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCategory } from '../entity/job-category.entity';
import { Repository } from 'typeorm';
import { CategoryNotFoundException } from '../domain/errors/CategoryNotFound.exception';
import { FindJobCategoriesResponseDTO, FindJobCategoryResponseDTO } from '../domain/requests/FindJobCategories.request.dto';

@Injectable()
export class JobCategoryService {
  constructor(
    @InjectRepository(JobCategory)
    private jobCategoryRepository: Repository<JobCategory>,
  ) {}

  async findAll(): Promise<FindJobCategoriesResponseDTO | CategoryNotFoundException> {
    const jobCategories = await this.jobCategoryRepository.find();

    if (jobCategories.length === 0) throw new CategoryNotFoundException();

    else  {
      const categories = jobCategories.map((category) => {
        return {
          id_category: category.id_category,
          name: category.name,
          image_url: category.image_url,
        };
      });

      return categories
    }
  }

  async findOne(id: number): Promise<FindJobCategoryResponseDTO | CategoryNotFoundException> {
    const jobCategory = await this.jobCategoryRepository.findOne({
      where: { id_category: id },
    });

    if (!jobCategory) throw new CategoryNotFoundException();
    
    else return {
      id_category: jobCategory.id_category,
      name: jobCategory.name,
      image_url: jobCategory.image_url,
    }
    
  }
}

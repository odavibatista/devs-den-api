import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { JobCategoryController } from './controller/job-category.controller';
import { JobCategoryService } from './service/job-category.service';
import { CategoryNotFoundException } from './domain/errors/CategoryNotFound.exception';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from './entity/job-category.entity';
import { Job } from '../job/entity/job.entity';
import { Skill } from '../skill/entity/skill.entity';
import { AuthenticationMiddleware } from '../user/middlewares/Auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    CategoryNotFoundException,
    JobCategoryModule,
    TypeOrmModule.forFeature([JobCategory, Job, Skill]),
    forwardRef(() => UserModule),
  ],
  controllers: [JobCategoryController],
  providers: [JobCategoryService],
})
export class JobCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthenticationMiddleware).forRoutes(
        {
          path: 'job-category/browse',
          method: RequestMethod.GET,
        },
        {
          path: 'job-category/:id/find',
          method: RequestMethod.GET,
        }
    )
  }
}
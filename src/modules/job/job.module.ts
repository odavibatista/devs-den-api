import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { JobService } from './service/job.service';
import { ConjunctJobsController, IndividualJobController } from './controller/job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { JobCategory } from '../job-category/entity/job-category.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Skill } from '../skill/entity/skill.entity';
import { Company } from '../company/entity/company.entity';
import { UserModule } from '../user/user.module';
import { AuthenticationMiddleware } from '../user/middlewares/Auth.middleware';
import { User } from '../user/entity/user.entity';
import { Candidate } from '../candidate/entity/candidate.entity';

@Module({
  imports: [
    DatabaseModule,
    JobModule,
    TypeOrmModule.forFeature([Job, JobCategory, Skill, Company, User, Candidate]),
    forwardRef(() => UserModule),
  ],

  providers: [JobService, JobCategory],

  controllers: [ConjunctJobsController, IndividualJobController],
})
export class JobModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({
      path: 'job/create',
      method: RequestMethod.POST,
    });
  }
}
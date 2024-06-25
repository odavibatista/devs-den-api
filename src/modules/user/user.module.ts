import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';
import { User } from './entity/user.entity';
import { Address } from '../address/entity/address.entity';
import { UserClearingService, UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { JWTProvider } from './providers/JWT.provider';
import { Candidate } from '../candidate/entity/candidate.entity';
import { Company } from '../company/entity/company.entity';
import { HashProvider } from './providers/hash.provider';
import { CompanyModule } from '../company/company.module';
import { CandidateModule } from '../candidate/candidate.module';
import { AuthenticationMiddleware } from './middlewares/Auth.middleware';
import { JobCategoryModule } from '../job-category/job-category.module';
import { JobModule } from '../job/job.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Address, Candidate, Company]),
    forwardRef(() => CandidateModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => JobCategoryModule),
    forwardRef(() => JobModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserClearingService, JWTProvider, HashProvider],
  exports: [JWTProvider, HashProvider, UserService, UserClearingService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'user/:id/delete', method: RequestMethod.DELETE },
        { path: 'user/:id/search', method: RequestMethod.GET },
        { path: 'user/home-data', method: RequestMethod.GET },
      );
  }
}

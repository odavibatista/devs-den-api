import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { User } from './entity/user.entity';
import { Address } from '../address/entity/address.entity';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { JWTProvider } from './providers/JWT.provider';
import { Candidate } from '../candidate/entity/candidate.entity';
import { Company } from '../company/entity/company.entity';
import { HashProvider } from './providers/hash.provider';
import { CompanyModule } from '../company/company.module';
import { CandidateModule } from '../candidate/candidate.module';
import { AuthenticationMiddleware } from './middlewares/Auth.middleware';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Address, Candidate, Company]),
    forwardRef(() => CandidateModule),
    forwardRef(() => CompanyModule)
    
  ],
  controllers: [UserController],
  providers: [UserService, JWTProvider, HashProvider],
  exports: [JWTProvider, HashProvider, UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      { path: 'user/:id/delete', method: RequestMethod.DELETE },
    )
  }
}

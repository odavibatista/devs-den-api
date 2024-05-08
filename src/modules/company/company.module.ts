import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import {
  ConjunctCompanyController,
  IndividualCompanyController,
} from './controller/company.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { User } from '../user/entity/user.entity';
import { Address } from '../address/entity/address.entity';
import { Uf } from '../uf/entity/uf.entity';
import { JWTProvider } from '../user/providers/JWT.provider';
import { UserModule } from '../user/user.module';
import { AuthenticationMiddleware } from '../user/middlewares/Auth.middleware';

@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    TypeOrmModule.forFeature([Company, User, Address, Uf]),
    UserModule
  ],
  controllers: [ConjunctCompanyController, IndividualCompanyController],
  providers: [CompanyService, JWTProvider],
})
export class CompanyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthenticationMiddleware).forRoutes(IndividualCompanyController)
  }
}
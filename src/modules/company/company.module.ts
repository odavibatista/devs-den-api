import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { ConjunctCompanyController, IndividualCompanyController } from './controller/company.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    TypeOrmModule.forFeature([Company, User]),
  ],
  controllers: [ConjunctCompanyController, IndividualCompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
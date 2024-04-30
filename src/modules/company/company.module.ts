import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { ConjunctCompanyController, IndividualCompanyController } from './controller/company.controller';

@Module({
  providers: [CompanyService],
  controllers: [ConjunctCompanyController, IndividualCompanyController]
})
export class CompanyModule {}

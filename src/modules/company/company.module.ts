import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController } from './controller/company.controller';

@Module({
  providers: [CompanyService],
  controllers: [CompanyController]
})
export class CompanyModule {}

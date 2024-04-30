import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { ConjunctCompanyController, IndividualCompanyController } from './controller/company.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AppService } from 'src/app/app.service';
import { AppController } from 'src/app/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    TypeOrmModule.forFeature([Company, User]),
  ],
  controllers: [AppController, ConjunctCompanyController, IndividualCompanyController],
  providers: [AppService, CompanyService],
})
export class CompanyModule {}

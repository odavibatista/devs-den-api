import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { DatabaseModule } from '../../../database/database.module';
import { CompanyModule } from '../company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '../../../modules/user/user.module';
import { Company } from '../entity/company.entity';
import { User } from '../../../modules/user/entity/user.entity';
import { Address } from '../../../modules/address/entity/address.entity';
import { Uf } from '../../../modules/uf/entity/uf.entity';
import { JWTProvider } from '../../../modules/user/providers/JWT.provider';
import { UserService } from '../../../modules/user/service/user.service';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CompanyModule,
        TypeOrmModule.forFeature([Company, User, Address, Uf]),
        forwardRef(() => UserModule),
      ],
      providers: [CompanyService, JWTProvider, UserService],
      exports: [CompanyService],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    userService = module.get<UserService>(UserService);
  });

  it('should bring all companies', async () => {
    const companies = await companyService.findAll();

    expect(companies).toBeDefined();
  })
});

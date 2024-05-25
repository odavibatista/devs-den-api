jest.mock('../../../modules/candidate/entity/candidate.entity', () => {
  return { Candidate: class Candidate {} };
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { JWTProvider } from '../providers/JWT.provider';
import { HashProvider } from '../providers/hash.provider';
import { DatabaseModule } from '../../../database/database.module';
import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Address } from '../../../modules/address/entity/address.entity';
import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Company } from '../../../modules/company/entity/company.entity';
import { CandidateModule } from '../../../modules/candidate/candidate.module';
import { CompanyModule } from '../../../modules/company/company.module';
import { JobCategoryModule } from '../../../modules/job-category/job-category.module';
import { JobModule } from '../../../modules/job/job.module';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, Address, Candidate, Company]),
        forwardRef(() => CandidateModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => JobCategoryModule),
        forwardRef(() => JobModule),
        
      ],
      controllers: [UserController],
      providers: [UserService, JWTProvider, HashProvider],
      exports: [JWTProvider, HashProvider, UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

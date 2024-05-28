import { Test, TestingModule } from '@nestjs/testing';
import { CandidateService } from './candidate.service';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../entity/candidate.entity';
import { Address } from '../../../modules/address/entity/address.entity';
import { User } from '../../../modules/user/entity/user.entity';
import { Uf } from '../../../modules/uf/entity/uf.entity';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '../../../modules/user/user.module';
import { UserService } from '../../../modules/user/service/user.service';

describe('ServiceService', () => {
  let candidateService: CandidateService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Candidate, Address, User, Uf]),
        forwardRef(() => UserModule),
      ],
      providers: [CandidateService, UserService],
      exports: [CandidateService],
    }).compile();

    candidateService = module.get<CandidateService>(CandidateService);
    userService = module.get<UserService>(UserService)
  });

  it('should not create ', () => {
    expect(candidateService).toBeDefined();
  });
});

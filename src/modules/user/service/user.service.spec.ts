import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Repository } from 'typeorm';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { CandidateModule } from '../../../modules/candidate/candidate.module';
import { Address } from '../../../modules/address/entity/address.entity';
import { Company } from '../../../modules/company/entity/company.entity';
import { CompanyModule } from '../../../modules/company/company.module';
import { JobModule } from '../../../modules/job/job.module';
import { JobCategoryModule } from '../../../modules/job-category/job-category.module';
import { JWTProvider } from '../providers/JWT.provider';
import { HashProvider } from '../providers/hash.provider';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>
  let candidateRepository: Repository<Candidate>
  let companyRepository: Repository<Candidate>
  let jwtProvider: JWTProvider
  let hashProvider: HashProvider

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
      providers: [UserService, JWTProvider, HashProvider],
      exports: [JWTProvider, HashProvider, UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not create an user with an e-mail with more than 50 characters', async () => {
    const user: CreateUserDTO = {
      email: "fulaninhodasilvamuitobacanaestoupreenchendocaracteresatoa@gmaaaaaaaaail.com",
      password: "@TestandoAlguma_Coisa_123456",
      role: 'candidate'
    }

    const createdUser = await service.create(user)

    expect(createdUser).toContain('status')
  });

  it('should not create an user with an e-mail with less than 10 characters', async () => {
    const user: CreateUserDTO = {
      email: "a@oi.com",
      password: "@TestandoAlguma_Coisa_123456",
      role: 'candidate'
    }

    const createdUser = await service.create(user)

    expect(createdUser).toContain('status')
  });

  it('should not create an user with an unformatted password', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilvamuitobacanaestoupreenchendocaracteresatoa@gmaaaaaaaaail.com",
      password: "1234",
      role: 'candidate'
    }

    const createdUser = await service.create(user)

    expect(createdUser).toContain('status')
  })
});

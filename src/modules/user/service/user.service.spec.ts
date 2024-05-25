import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Repository } from 'typeorm';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpException, forwardRef } from '@nestjs/common';
import { Address } from '../../../modules/address/entity/address.entity';
import { Company } from '../../../modules/company/entity/company.entity';
import { JWTProvider } from '../providers/JWT.provider';
import { HashProvider } from '../providers/hash.provider';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../domain/errors/UnformattedPassword.exception';

describe('UserService', () => {
  let userService: UserService;
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
        
      ],
      providers: [UserService, JWTProvider, HashProvider],
      exports: [JWTProvider, HashProvider, UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  /*
  afterEach(async () => {
    await userRepository.clear()
  })
  */

  it('should not create an user with an e-mail with more than 50 characters', async () => {

    const user: CreateUserDTO = {
      email: "fulaninhodasilvamuitobacanaestoupreenchendocaracteresatoa@gmaaaaaaaaail.com",
      password: "@TestandoAlguma_Coisa_123456",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create an user with an e-mail with less than 10 characters', async () => {
    const user: CreateUserDTO = {
      email: "a@oi.com",
      password: "@TestandoAlguma_Coisa_123456",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create an user with an unformatted password', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilvamuitobacanaestoupreenchendocaracteresatoa@gmaaaaaaaaail.com",
      password: "1234",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedPasswordException);
  });
});

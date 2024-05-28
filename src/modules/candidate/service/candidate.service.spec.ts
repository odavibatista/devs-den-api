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
import { RegisterCandidateBodyDTO } from '../domain/requests/RegisterCandidate.request.dto';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';
import { Company } from '../../../modules/company/entity/company.entity';
import { UnformattedPasswordException } from '../../../modules/user/domain/errors/UnformattedPassword.exception';
import { PasswordTooLongException } from '../../../modules/user/domain/errors/PasswordTooLong.exception';

describe('ServiceService', () => {
  let candidateService: CandidateService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Candidate, Address, User, Uf, Company]),
        forwardRef(() => UserModule),
      ],
      providers: [CandidateService, UserService],
      exports: [CandidateService],
    }).compile();

    candidateService = module.get<CandidateService>(CandidateService);
    userService = module.get<UserService>(UserService)
  });

  const candidate: RegisterCandidateBodyDTO = {
    name: 'Fulano da Silva',
    gender: 'male',
    birth_date: "1990-01-01",
    address:  {
      uf: 1,
      cep: '12345678',
      street: 'Rua do Fulano',
      number: '123',
      complement: 'Casa',
    },
    credentials: {
      email: 'fulanodasilva@gmail.com',
      password: 'TestandoAlguma_Coisa_123456',
    }
  }

  it('should not create a candidate with an e-mail with more than 50 characters', async () => {
    candidate.credentials.email = "fuuuuuuuuuuuuuulaaaaaaaaaaaaaaaaaaaaaanooooooooooooooooooooooo@gmail.com"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a candidate with an e-mail with less than 8 characters', async () => {
    candidate.credentials.email = "f@g.com"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a candidate with an e-mail without a domain', async () => {
    candidate.credentials.email = "fulano"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a candidate with an e-mail without a username', async () => {
    candidate.credentials.email = "@gmail.com"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a candidate with an uncompleted domain', async () =>  {
    candidate.credentials.email = "fulano@.com"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedEmailException);

    candidate.credentials.email = "fulano@gmail"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a candidate with a password with less than 15 characters', async () => {
    candidate.credentials.email = "fulanodasilva@gmail.com"
    candidate.credentials.password = "@Ab1"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedPasswordException);
  })

  it('should not create a candidate with a password with more than 50 characters', async () => {
    candidate.credentials.email = "fulanodasilva@gmail.com"
    candidate.credentials.password = "@Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(PasswordTooLongException);
  })

  it('should not create a candidate with a password without letters', async () =>  {
    candidate.credentials.password = "1234567890@"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedPasswordException);
  });
});

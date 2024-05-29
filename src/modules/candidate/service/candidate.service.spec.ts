import { Test, TestingModule } from '@nestjs/testing';
import { CandidateClearingService, CandidateService } from './candidate.service';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../entity/candidate.entity';
import { Address } from '../../../modules/address/entity/address.entity';
import { User } from '../../../modules/user/entity/user.entity';
import { Uf } from '../../../modules/uf/entity/uf.entity';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '../../../modules/user/user.module';
import { UserClearingService, UserService } from '../../../modules/user/service/user.service';
import { RegisterCandidateBodyDTO } from '../domain/requests/RegisterCandidate.request.dto';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';
import { Company } from '../../../modules/company/entity/company.entity';
import { UnformattedPasswordException } from '../../../modules/user/domain/errors/UnformattedPassword.exception';
import { PasswordTooLongException } from '../../../modules/user/domain/errors/PasswordTooLong.exception';
import { NameTooShortException } from '../../../modules/user/domain/errors/NameTooShort.exception';
import { NameTooLongException } from '../../../modules/user/domain/errors/NameTooLong.exception';
import { UnformattedNameException } from '../../../modules/user/domain/errors/UnformattedName.exception';

describe('ServiceService', () => {
  let candidateService: CandidateService;
  let userService: UserService;
  let userClearingService: UserClearingService;
  let candidateClearingService: CandidateClearingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Candidate, Address, User, Uf, Company]),
        forwardRef(() => UserModule),
      ],
      providers: [CandidateService, UserService, UserClearingService, CandidateClearingService],
      exports: [CandidateService],
    }).compile();

    candidateService = module.get<CandidateService>(CandidateService);
    userService = module.get<UserService>(UserService)
    userClearingService = module.get<UserClearingService>(UserClearingService)
    candidateClearingService = module.get<CandidateClearingService>(CandidateClearingService)
  });

  afterEach(async () => {
    // await candidateClearingService.wipe()
    await userClearingService.wipe()
  })

  const candidate: RegisterCandidateBodyDTO = {
    name: 'Fulano da Silva',
    gender: 'male',
    birth_date: "1990-01-01",
    address:  {
      uf: 1,
      cep: '12345678',
      street: 'Rua do Fulano',
      number: '123',
      city: 'São Paulo',
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

  it('should not create a candidate with a password without without at least one letter', async () =>  {
    candidate.credentials.password = "1234567890@"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a candidate with a password without at least one number', async () =>  {
    candidate.credentials.password = "Asadasdasd@"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a candidate with a password without at least one capital letter', async () =>  {
    candidate.credentials.password = "abcdfg@@)$(@412412)$"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a candidate with a password without at least one special character', async () =>  {
    candidate.credentials.password = "Abcdefg123"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a candidate with a password without at least one minor letter', async () =>  {
    candidate.credentials.password = "AAAAAAAAAAAAAAAAAA@"

    expect(async () => {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedPasswordException);    
  })

  it('should not create a candidate which name has less than 5 characters', async ()  =>  {
    candidate.credentials.password="@FulaninhoDaSilva12345678910@"
    candidate.name = "Abcd"

    expect(async  ()  =>  {
      await candidateService.create(candidate)
    }).rejects.toThrow(NameTooShortException)
  })

  it('should not create a candidate which name has more than 50 characters', async ()  =>  {
    candidate.name = "AbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcd"

    expect(async  ()  =>  {
      await candidateService.create(candidate)
    }).rejects.toThrow(NameTooLongException)
  })

  it('should not create a candidate which name has numbers', async ()  =>  {
    candidate.name = "Fulano 123"

    expect(async  ()  =>  {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedNameException)
  })
  
  it('should not create a candidate which name has special characters', async ()  =>  {
    candidate.name = "Fulano!"

    expect(async  ()  =>  {
      await candidateService.create(candidate)
    }).rejects.toThrow(UnformattedNameException)
  })
});

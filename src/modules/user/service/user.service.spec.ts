import { Test, TestingModule } from '@nestjs/testing';
import { UserClearingService, UserService } from './user.service';
import { CreateUserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Repository } from 'typeorm';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../../../modules/address/entity/address.entity';
import { Company } from '../../../modules/company/entity/company.entity';
import { JWTProvider } from '../providers/JWT.provider';
import { HashProvider } from '../providers/hash.provider';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../domain/errors/UnformattedPassword.exception';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { CompanyService } from '../../../modules/company/service/company.service';
import { Uf } from '../../../modules/uf/entity/uf.entity';
import { CandidateService } from '../../../modules/candidate/service/candidate.service';
import { UfService } from '../../../modules/uf/service/uf.service';

describe('UserService', () => {
  let userService: UserService;
  let clearingService: UserClearingService
  let companyService: CompanyService
  let candidateService: CandidateService
  let ufService: UfService
  let userRepository: Repository<User>
  let candidateRepository: Repository<Candidate>
  let companyRepository: Repository<Candidate>
  let addressRepository: Repository<Address>
  let ufRepository: Repository<Uf>
  let jwtProvider: JWTProvider
  let hashProvider: HashProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, Address, Candidate, Company, Uf]),
        
      ],
      providers: [UserService, JWTProvider, HashProvider, UserClearingService, CompanyService, CandidateService, UfService],
      exports: [JWTProvider, HashProvider, UserService, UserClearingService, CompanyService, CandidateService],
    }).compile();

    userService = module.get<UserService>(UserService);
    clearingService = module.get<UserClearingService>(UserClearingService)
    companyService = module.get<CompanyService>(CompanyService)
    candidateService = module.get<CandidateService>(CandidateService)
    ufService = module.get<UfService>(UfService)
    hashProvider = module.get<HashProvider>(HashProvider)
  });

  afterEach(async () => {
    await clearingService.wipe()
  })

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

  it('should not create an user with a password with less then 15 characters', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilva@gmail.com",
      password: "1234",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create an user with a password without letters', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilva@gmail.com",
      password: "1234@4125@@",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create an user with a password without numbers', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilva@gmail.com",
      password: "abcdfg@@)$(@)$",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create an user with a password without at least one capital letter', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilva@gmail.com",
      password: "abcdfg@@)$(@412412)$",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create an user with a password without special characters', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilva@gmail.com",
      password: "abcdfgh21124981024",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create an user with a password without at least one minor letter', async () =>  {
    const user: CreateUserDTO = {
      email: "fulaninhodasilva@gmail.com",
      password: "1131313@@@TESTEEEE",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should create an user with a valid e-mail and password', async () => {
    const user: CreateUserDTO = {
      email: "fulaninhosilva@gmail.com",
      password: "@Algumacoisa123456789101_",
      role: 'candidate'
    }
    const request = await userService.create(user)

    expect(request).toMatchObject({
      user: {
        email: user.email,
        role: user.role,
      },
      id: expect.any(Number)
    })
  });

  it('should not create an user with an already registered e-mail', async () => {
    const user: CreateUserDTO = {
      email: "fulaninhodasilva@gmail.com",
      password: "@Algumacoisa123456789101_",
      role: 'candidate'
    }

    expect(async () => {
      await userService.create(user)
      await userService.create(user)
    }).rejects.toThrow(EmailAlreadyRegisteredException);
  });

  it('should return true comparing the password with the hash provider', async () => {
    const user: CreateUserDTO = {
      email: "zezinhodasilva@gmail.com",
      password: "@Algumacoisa123456789101_",
      role: 'candidate'
    }

    const hashedPassword = await hashProvider.hash(user.password)

    expect(await hashProvider.compare(user.password, hashedPassword)).toBe(true)
  })

  it('should login an user given the valid credentials', async () => {
    const basalRequest = await ufService.findAll()

    const candidate = {
      name: "Zezinho da Silva",
      birth_date: "1999-12-12",
      gender: 'male',
      credentials: {
        email: "zezinhodasilva@gmail.com",
        password: "@Algumacoisa123456789101_",
      },
      address: {
        cep: "12345678",
        city: "São Paulo",
        number: "123",
        uf: basalRequest.length,
        street: "Rua dos Bobos"
      }
    }

    await candidateService.create(candidate)

    const request = await userService.login({
      email: candidate.credentials.email,
      inserted_password: candidate.credentials.password
    })

    expect(request).toMatchObject({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        name: candidate.name,
        role: 'candidate'
      }
    })
  })
})

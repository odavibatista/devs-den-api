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
import { UserClearingService, UserService } from '../../../modules/user/service/user.service';
import { RegisterCompanyBodyDTO } from '../domain/requests/RegisterCompany.request.dto';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let userService: UserService;
  let userClearingService: UserClearingService;

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

  afterEach(async () => {
    await userClearingService.wipe()
  })

  it('should bring all companies', async () => {
    const companies = await companyService.findAll();

    expect(companies).toBeDefined();
  })

  const company: RegisterCompanyBodyDTO = {
    company_name: 'Company Test',
    cnpj: '15364400000153',
    address:  {
      uf: 1,
      cep: '12345678',
      street: 'Rua do Fulano',
      number: '123',
      city: 'São Paulo',
      complement: 'Casa',
    },
    credentials: {
      email: 'test@company.com',
      password: 'TestandoAlguma_Coisa_123456',
    }
  }

  jest.setTimeout(1000 * 10)

  it('should not create a company with an e-mail with more than 50 characters', async () => {
    company.credentials.email = "coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooompany@gmail.com"

    expect(async () => {
      await companyService.create(company)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a company with an e-mail with less than 8 characters', async () => {
    company.credentials.email = "a@a.c"

    expect(async () => {
      await companyService.create(company)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a company with an invalid e-mail', async () => {
    company.credentials.email = "company.com"

    expect(async () => {
      await companyService.create(company)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a company with an e-mail without a domain', async () => {
    company.credentials.email = "fulano"

    expect(async () => {
      await companyService.create(company)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a company with an e-mail without a username', async () => {
    company.credentials.email = "@gmail.com"

    expect(async () => {
      await companyService.create(company)
    }).rejects.toThrow(UnformattedEmailException);
  })

  it('should not create a company with an email with an uncompleted domain', async () =>  {
    company.credentials.email = "fulano@.com"

    expect(async () => {
      await companyService.create(company)
    }).rejects.toThrow(UnformattedEmailException);

    company.credentials.email = "fulano@gmail"

    expect(async () => {
      await companyService.create(company)
    }).rejects.toThrow(UnformattedEmailException);
  })
});

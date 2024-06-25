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
import {
  UserClearingService,
  UserService,
} from '../../../modules/user/service/user.service';
import { RegisterCompanyBodyDTO } from '../domain/requests/RegisterCompany.request.dto';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../../../modules/user/domain/errors/UnformattedPassword.exception';
import { PasswordTooLongException } from '../../user/domain/errors/PasswordTooLong.exception';
import { NameTooShortException } from '../../user/domain/errors/NameTooShort.exception';
import { UFNotFoundException } from '../../uf/domain/errors/UfNotFound.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { InvalidCNPJException } from '../domain/errors/InvalidCNPJ.exception';
import { CompanyNotFoundException } from '../domain/errors/CompanyNotFound.exception';

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
    userClearingService = module.get<UserClearingService>(UserClearingService);
  });

  afterEach(async () => {
    await userClearingService.wipe();
  });

  const company: RegisterCompanyBodyDTO = {
    company_name: 'Company Test',
    cnpj: '15364400000153',
    address: {
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
    },
  };

  jest.setTimeout(1000 * 10);

  it('should bring all companies', async () => {
    const companies = await companyService.findAll();

    expect(companies).toBeInstanceOf(Array);
    // Fix the service then come back here
  });

  it('should not create a company with an e-mail with more than 50 characters', async () => {
    company.credentials.email =
      'coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooompany@gmail.com';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create a company with an e-mail with less than 8 characters', async () => {
    company.credentials.email = 'a@a.c';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create a company with an invalid e-mail', async () => {
    company.credentials.email = 'company.com';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create a company with an e-mail without a domain', async () => {
    company.credentials.email = 'fulano';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create a company with an e-mail without a username', async () => {
    company.credentials.email = '@gmail.com';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create a company with an email with an uncompleted domain', async () => {
    company.credentials.email = 'fulano@.com';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedEmailException);

    company.credentials.email = 'fulano@gmail';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedEmailException);
  });

  it('should not create a company with a password with less than 15 characters', async () => {
    company.credentials.email = 'fulanodasilva@gmail.com';
    company.credentials.password = '@Ab1';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a company with a password with more than 50 characters', async () => {
    company.credentials.password =
      '@Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1Ab1';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(PasswordTooLongException);
  });

  it('should not create a company with a password without without at least one letter', async () => {
    company.credentials.password = '1234567890@';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a company with a password without at least one number', async () => {
    company.credentials.password = 'Asadasdasd@';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a company with a password without at least one capital letter', async () => {
    company.credentials.password = 'abcdfg@@)$(@412412)$';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a company with a password without at least one special character', async () => {
    company.credentials.password = 'Abcdefg123';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a company with a password without at least one minor letter', async () => {
    company.credentials.password = 'AAAAAAAAAAAAAAAAAA@';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnformattedPasswordException);
  });

  it('should not create a company which name has less than 5 characters', async () => {
    company.credentials.password = '@EmpresinhaQualquer12345678910@';
    company.company_name = 'Abcd';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(NameTooShortException);
  });

  it('should not create a company which name has more than 50 characters', async () => {
    company.company_name =
      'AbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcdAbcd';

      expect(async () => {
        await companyService.create(company);
      }).rejects.toThrow(NameTooShortException);
  });

  it('should not create a company passing an unvalid UF id', async () => {
    company.company_name = 'Coca Cola S/A';
    company.address.uf = 0;

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UFNotFoundException);
  });

  it('should not create a company passing a city which length is less than 3 characters', async () => {
    company.address.uf = 1;
    company.address.city = 'Ab';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a city which names has more than 50 characters', async () => {
    company.address.uf = 1;
    company.address.city =
      'AbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAbAb';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a city that contains numbers', async () => {
    company.address.city = 'Cidade 1';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a city that contains special characters', async () => {
    company.address.city = 'Cidade []';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a cep that contains letters', async () => {
    company.address.city = 'São Paulo';
    company.address.cep = '31245ABC';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a cep that contains special characters', async () => {
    company.address.cep = '31245(((';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a cep that contains less than 8 characters', async () => {
    company.address.cep = '31245';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a cep that contains more than 8 characters', async () => {
    company.address.cep = '3124531245';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a street that contains less than 1 character', async () => {
    company.address.cep = '12345678';
    company.address.street = '';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing a street that contains more than 100 characters', async () => {
    company.address.street =
      'abcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmnoabcdfghijklmno';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing an address number that contains less than 1 character', async () => {
    company.address.street = 'Rua dos Bobos';
    company.address.number = '';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing an address number that contains more than than 10 character', async () => {
    company.address.number = '12412941249124';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing an address complement that contains less than 1 characters', async () => {
    company.address.number = '1';
    company.address.complement = '';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a company passing an address complement that contains more than 100 characters', async () => {
    company.address.complement =
      '124129412491241241294124912412412941249124124129412491241241294124912412412941249124124129412491241241294124912412412941249124124129412491241241294124912412412941249124'

      expect(async () => {
        await companyService.create(company);
      }).rejects.toThrow(UnprocessableDataException);
  })

  it('should not create a company passing an address complement that contains special characters', async () => {
    company.address.complement = 'Casa @';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(UnprocessableDataException);
  })

  it('should not create a company passing a cnpj that contains letters', async () => {
    company.address.complement = 'Prédio';
    company.cnpj = '1234567890ABC';

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(InvalidCNPJException);
  })

  it('should not create a company passing a cnpj that contains special characters', async () => {
    company.cnpj = '1234567890@'

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(InvalidCNPJException);
  })

  it('should not create a company passing a cnpj that contains less than 14 characters', async () => {
    company.cnpj = '120123'

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(InvalidCNPJException);
  })

  it('should not create a company passing a cnpj that contains more than 14 characters', async () => {
    company.cnpj = '120123123123123'

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(InvalidCNPJException);
  })

  it('should not create a company passing a cnpj that contains a repeated sequence of numbers', async () => {
    company.cnpj = '00000000000000'

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(InvalidCNPJException);
  })

  it('should not create a company passing a cnpj that contains a invalid verification digit', async () => {
    company.cnpj = '15364400000154'

    expect(async () => {
      await companyService.create(company);
    }).rejects.toThrow(InvalidCNPJException);
  })

  it('should create a company given the valid credentials', async () => {
    company.cnpj = '61887271000103';

    const response = await companyService.create(company);

    expect(response).toHaveProperty('user');
  })

  it('should not return a company given an unvalid id', async ()  =>  {
    expect(async () => {
      await companyService.findOne(0);
    }).rejects.toThrow(CompanyNotFoundException);
  })

  it('should not delete a company given an unvalid id', async () => {
    expect(async () => {
      await companyService.delete(0);
    }).rejects.toThrow(CompanyNotFoundException);
  })
});

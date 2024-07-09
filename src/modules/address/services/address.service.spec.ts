import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressClearingService, AddressService } from './address.service';
import { DatabaseModule } from 'src/database/database.module';
import { User } from 'src/modules/user/entity/user.entity';
import { Address } from '../entity/address.entity';
import { Candidate } from 'src/modules/candidate/entity/candidate.entity';
import { Company } from 'src/modules/company/entity/company.entity';
import { Uf } from 'src/modules/uf/entity/uf.entity';
import { UserClearingService, UserService } from 'src/modules/user/service/user.service';
import { UfService } from 'src/modules/uf/service/uf.service';
import { CreateAddressRequestDTO } from '../domain/requests/CreateAddress.request.dto';
import { CreateUserDTO } from 'src/modules/user/dto/user.dto';

describe('AddressService', () => {
  let addressService: AddressService;
  let addressClearingService: AddressClearingService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, Address, Candidate, Company, Uf]),
      ],
      providers: [
        UserService,
        UserClearingService,
        UfService,
      ],
      exports: [
        UserService,
        UserClearingService,
      ],
    }).compile();

    addressService = module.get<AddressService>(AddressService);
    addressClearingService = module.get<AddressClearingService>(AddressClearingService);
    userService = module.get<UserService>(UserService);
  });

  const user: CreateUserDTO = {
    email: 'zezinhodasilva@gmail.com',
    password: '@Algumacoisa123456789101_',
    role: 'candidate',
  }
  
  beforeAll(async () => {
    await userService.create(user);
  })

  const address: CreateAddressRequestDTO = {
    id_address: 1,
    uf_id: 1,
    city: 'city',
    cep: '00000000',
    street: 'street',
    number: 'number',
    complement: 'complement',
  };

  jest.setTimeout(1000 * 10);

  afterEach(async () => {
    await addressClearingService.wipe();
  });
});

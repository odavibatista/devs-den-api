import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>
  let candidateRepository: Repository<Candidate>
  let companyRepository: Repository<Candidate>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
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

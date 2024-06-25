import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { CompanyService } from '../../company/service/company.service';
import { DatabaseModule } from '../../../database/database.module';
import { CompanyModule } from '../../company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { Company } from '../../company/entity/company.entity';
import { User } from '../../user/entity/user.entity';
import { UserModule } from '../../user/user.module';
import { UserService } from '../../user/service/user.service';
import { RegisterCompanyBodyDTO } from '../../company/domain/requests/RegisterCompany.request.dto';
import { CreateJobBodyDTO } from '../domain/requests/CreateJob.request.dto';
import { JobNotFoundException } from '../domain/errors/JobNotFound.exception';

describe('ServiceService', () => {
  let jobService: JobService;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CompanyModule,
        TypeOrmModule.forFeature([Company, User]),
        forwardRef(() => UserModule),
      ],
      providers: [CompanyService, UserService],
      exports: [CompanyService],
    }).compile();

    jobService = module.get<JobService>(JobService);
    companyService = module.get<CompanyService>(CompanyService);
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

  const job: CreateJobBodyDTO = {
    title: 'Job Test',
    description: 'Job Description',
    wage: 1000,
    modality: 'remote',
    contract: 'clt',
    job_category_id: 1
  }

  jest.setTimeout(1000 * 10);
  
  beforeAll(async () => {
    await companyService.create(company)
    await jobService.createJob(job, 1)
  })

  it('should bring all jobs', async () => {
    const jobs = await jobService.findAll();

    expect(jobs).toBeInstanceOf(Array);
  });

  it('should not find a job given an invalid id', async () => {
    expect(async () => {
      await jobService.findOne(0);
    }).rejects.toThrow(JobNotFoundException);
  })

  it('should find a job given its id', async () => {
    const jobs = await jobService.findAll();
    const job = await jobService.findOne(jobs[0].id_job);

    expect(job).toHaveProperty('job');
    expect(job).toHaveProperty('company');
  })
});

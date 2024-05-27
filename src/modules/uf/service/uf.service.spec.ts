import { Test, TestingModule } from '@nestjs/testing';
import { UfService } from './uf.service';
import { Uf } from '../entity/uf.entity';
import { DatabaseModule } from '../../../database/database.module';
import { UfModule } from '../uf.module';
import UfSeeder from '../seeders/uf.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UfController } from '../controller/uf.controller';

describe('UfService', () => {
  let ufService: UfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        UfModule,
        UfSeeder,
        Uf,
        TypeOrmModule.forFeature([Uf]),
      ],
      providers: [UfService],
      controllers: [UfController],
    }).compile();

    ufService = module.get<UfService>(UfService);
  });

  it('should bring all the UFs from the database', async () => {
    const request = await ufService.findAll()

    expect(request).toBeInstanceOf(Array)
    
    expect(typeof request[0].id_uf).toEqual("number")
    expect(typeof request[0].name).toEqual("string")
    expect(typeof request[0].acronym).toEqual("string")
  });

  it('should contain 27 ufs in total if the database has been previously seeded', async () =>  {
    const request = await ufService.findAll()

    expect(request).toHaveLength(27)
  })
});

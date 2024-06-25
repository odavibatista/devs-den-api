import { Test, TestingModule } from '@nestjs/testing';
import { UfService } from './uf.service';
import { Uf } from '../entity/uf.entity';
import { DatabaseModule } from '../../../database/database.module';
import { UfModule } from '../uf.module';
import UfSeeder from '../seeders/uf.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UfController } from '../controller/uf.controller';
import { TOTAL_OF_UFS } from '../seeders/uf.sample';

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
    const request = await ufService.findAll();

    expect(request).toBeInstanceOf(Array);

    expect(request[0]).toHaveProperty('id_uf');
    expect(typeof request[0].id_uf).toEqual('number');
    expect(request[0]).toHaveProperty('name');
    expect(typeof request[0].name).toEqual('string');
    expect(request[0]).toHaveProperty('acronym');
    expect(typeof request[0].acronym).toEqual('string');
  });

  it(`should contain ${TOTAL_OF_UFS} ufs in total if the database has been previously seeded`, async () => {
    const request = await ufService.findAll();

    expect(request).toHaveLength(TOTAL_OF_UFS);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from './skill.service';
import { DatabaseModule } from '../../../database/database.module';
import { SkillModule } from '../skill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../entity/skill.entity';
import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Job } from '../../../modules/job/entity/job.entity';
import { SkillNotFoundException } from '../domain/errors/SkillNotFound.exception';
import { TOTAL_OF_SKILLS } from '../seeders/skill.sample';

describe('SkillService', () => {
  let skillService: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        SkillModule,
        TypeOrmModule.forFeature([Skill, Candidate, Job]),
      ],
      providers: [SkillService],
    }).compile();

    skillService = module.get<SkillService>(SkillService);
  });

  it('should bring all the skills from the database', async () => {
    const request = await skillService.findAll();

    expect(request).toBeInstanceOf(Array);

    expect(request[0]).toHaveProperty('id_skill');
    expect(typeof request[0].id_skill).toEqual('number');
    expect(request[0]).toHaveProperty('name');
    expect(typeof request[0].name).toEqual('string');
  });

  it(`should contain ${TOTAL_OF_SKILLS} skills in total if the database has been previously seeded`, async () => {
    const request = await skillService.findAll();

    expect(request).toHaveLength(TOTAL_OF_SKILLS);
  });

  it('should bring a single skill from the database', async () => {
    const basalRequest = await skillService.findAll();

    const request = await skillService.findOne(basalRequest[0].id_skill);

    expect(request).toHaveProperty('id_skill');
    expect(typeof request.id_skill).toEqual('number');
    expect(request).toHaveProperty('name');
    expect(typeof request.name).toEqual('string');
    expect(request).toHaveProperty('created_at');
    expect(typeof request.created_at).toEqual('object');
    expect(request).toHaveProperty('updated_at');
    expect(typeof request.updated_at).toEqual('object');
  });

  it('should throw an error if an unvalid number is passed on the individual skill finder', async () => {
    expect(async () => {
      await skillService.findOne(0);
    }).rejects.toThrow(SkillNotFoundException);
  });
});

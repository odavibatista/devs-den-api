import { Module } from '@nestjs/common';
import { SkillService } from './service/skill.service';
import {
  ConjunctSkillController,
  IndividualSkillController,
} from './controller/skill.controller';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entity/skill.entity';
import { Candidate } from '../candidate/entity/candidate.entity';
import { Job } from '../job/entity/job.entity';

@Module({
  imports: [
    DatabaseModule,
    SkillModule,
    TypeOrmModule.forFeature([Skill, Candidate, Job]),
  ],
  providers: [SkillService],
  controllers: [ConjunctSkillController, IndividualSkillController],
})
export class SkillModule {}

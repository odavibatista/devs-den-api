import { Module } from '@nestjs/common';
import { SkillService } from './service/skill.service';
import { ConjunctSkillController, IndividualSkillController } from './controller/skill.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skills } from './entity/skill.entity';
import { Candidate } from '../candidate/entity/candidate.entity';
import { Jobs } from '../job/entity/job.entity';

@Module({
  imports: [
    DatabaseModule,
    SkillModule,
    TypeOrmModule.forFeature([Skills, Candidate, Jobs]),
  ],
  providers: [SkillService],
  controllers: [ConjunctSkillController, IndividualSkillController]
})
export class SkillModule {}

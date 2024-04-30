import { Module } from '@nestjs/common';
import { SkillService } from './service/skill.service';
import { SkillController } from './controller/skill.controller';

@Module({
  providers: [SkillService],
  controllers: [SkillController]
})
export class SkillModule {}

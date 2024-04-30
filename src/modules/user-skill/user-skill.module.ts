import { Module } from '@nestjs/common';
import { UserSkillService } from './service/user-skill.service';
import { UserSkillController } from './controller/user-skill.controller';

@Module({
  providers: [UserSkillService],
  controllers: [UserSkillController]
})
export class UserSkillModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CompanyModule } from '../modules/company/company.module';
import { UserModule } from '../modules/user/user.module';
import { JobModule } from '../modules/job/job.module';
import { UfModule } from '../modules/uf/uf.module';
import { CandidateModule } from '../modules/candidate/candidate.module';
import { SkillModule } from '../modules/skill/skill.module';
import { JobCategoryModule } from '../modules/job-category/job-category.module';

@Module({
  imports: [DatabaseModule, UserModule, CompanyModule, JobModule, UfModule, CandidateModule, SkillModule, JobCategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
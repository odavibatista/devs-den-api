import { Module } from '@nestjs/common';
import { CandidateService } from './service/candidate.service';
import { CandidateController } from './controller/controller.controller';

@Module({
  providers: [CandidateService],
  controllers: [CandidateController]
})
export class CandidateModule {}

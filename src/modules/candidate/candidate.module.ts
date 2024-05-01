import { Module } from '@nestjs/common';
import { CandidateService } from './service/candidate.service';
import { CandidateController } from './controller/candidate.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entity/candidate.entity';
import { Address } from '../user/entity/address.entity';
import { User } from '../user/entity/user.entity';
import { Uf } from '../uf/entity/uf.entity';

@Module({
  imports:  [
    DatabaseModule,
    TypeOrmModule.forFeature([Candidate, Address, User, Uf]),
  ],
  providers: [CandidateService],
  controllers: [CandidateController]
})
export class CandidateModule {}

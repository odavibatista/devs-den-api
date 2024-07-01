import { Module, forwardRef } from '@nestjs/common';
import { CandidateService } from './service/candidate.service';
import { CandidateController } from './controller/candidate.controller';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entity/candidate.entity';
import { Address } from '../address/entity/address.entity';
import { User } from '../user/entity/user.entity';
import { Uf } from '../uf/entity/uf.entity';
import { UserModule } from '../user/user.module';
import { JWTProvider } from '../user/providers/JWT.provider';
import { AddressService } from '../address/services/address.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Candidate, Address, User, Uf]),
    forwardRef(() => UserModule),
  ],
  providers: [CandidateService, JWTProvider, AddressService],
  controllers: [CandidateController],
  exports: [CandidateService],
})
export class CandidateModule {}

import { Module, forwardRef } from '@nestjs/common';
import { AddressService } from './services/address.service';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../candidate/entity/candidate.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Candidate, User]),
  ],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}

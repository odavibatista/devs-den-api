import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { User } from './entity/user.entity';
import { AddressEntity } from './entity/address.entity';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, AddressEntity]),
      ],
      controllers: [AppController],
      providers: [AppService],
})
export class UserModule {}

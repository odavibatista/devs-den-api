import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { User } from './entity/user.entity';
import { AddressEntity } from './entity/address.entity';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, AddressEntity]),
      ],
      controllers: [AppController, UserController],
      providers: [AppService, UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { User } from './entity/user.entity';
import { Address } from './entity/address.entity';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { JWTProvider } from './providers/JWT.provider';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, Address]),
      ],
      controllers: [UserController],
      providers: [UserService, JWTProvider],
})
export class UserModule {}

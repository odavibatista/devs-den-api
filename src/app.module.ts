import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserService } from './users/service/user.service';
import { UserController } from './users/controller/user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}

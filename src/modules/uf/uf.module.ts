import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import UfSeeder from './seeders/uf.seeder';
import { Uf } from './entity/uf.entity';
import { UfService } from './service/uf.service';
import { UfController } from './controller/uf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        DatabaseModule,
        UfModule,
        UfSeeder,
        Uf,
        TypeOrmModule.forFeature([Uf]),
    ],
    providers: [UfService],
    controllers: [UfController],
})
export class UfModule {}

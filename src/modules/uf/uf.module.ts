import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import UfSeeder from './seeders/uf.seeder';
import { Uf } from './entity/uf.entity';

@Module({
    imports: [
        DatabaseModule,
        UfModule,
        UfSeeder,
        Uf
    ],
})
export class UfModule {}

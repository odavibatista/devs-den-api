import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

@Global()
@Module({
    imports:    [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: configService.get<any>('DB_ENGINE'),
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [configService.get<string>('DB_ENTITIES')],
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
                logging: configService.get<boolean>('DB_LOGGING'),
                logger: 'advanced-console',
              }),
    
          }),
    ],
})
export class DatabaseModule {}

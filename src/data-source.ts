import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { appConfigurations } from './shared/config/app.config';

const options: DataSourceOptions & SeederOptions = {
    type: appConfigurations.DB_ENGINE as any,
    database: appConfigurations.DB_DATABASE,
    username: appConfigurations.DB_USER,
    password: appConfigurations.DB_PASSWORD,
    host: appConfigurations.DB_HOST,
    port: appConfigurations.DB_PORT,
    entities: [appConfigurations.DB_ENTITIES],
    logging: appConfigurations.DB_LOGGING,
    synchronize: appConfigurations.DB_SYNCHRONIZE,

    seeds: ['./*.seeder.ts'],
    factories: ['./*.factory.ts']
    
};

export const AppDataSource = new DataSource(options)

import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { appConfigurations } from '../shared/config/app.config';
import { MainSeeder } from '../modules/Main.seeder';

const options: DataSourceOptions & SeederOptions = {
    type: appConfigurations.DB_ENGINE as any,
    database: appConfigurations.DB_DATABASE,
    username: appConfigurations.DB_USER,
    password: appConfigurations.DB_PASSWORD,
    host: appConfigurations.DB_HOST,
    port: appConfigurations.DB_PORT,
    // I want all the files that ends with .entity.ts
	entities: [`./**/{uf,job-category}.entity.ts`],
    logging: appConfigurations.DB_LOGGING,
    synchronize: appConfigurations.DB_SYNCHRONIZE,

    seeds: [MainSeeder]
    
};

export const AppDataSource = new DataSource(options)

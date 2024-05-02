import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Uf } from '../entity/uf.entity';

export default class UfSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository =  dataSource.getRepository(Uf);
        const ufs = [
            {
                name: 'São Paulo',
                acronym: 'SP',
            },
            {
                name: 'Rio de Janeiro',
                acronym: 'RJ',
            },
            {
                name: 'Minas Gerais',
                acronym: 'MG',
            }
        ]
        // ---------------------------------------------------

        const newUfs = await repository.create(ufs)
        await repository.save(newUfs)
    }
}
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Uf } from '../entity/uf.entity';

export default class UfSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository =  dataSource.getRepository(Uf);
        await repository.insert([
            {
                acronym: 'AC',
                name: 'Acre'
            },
            {
                acronym: 'AL',
                name: 'Alagoas'
            },
            {
                acronym: 'AM',
                name: 'Amazonas'
            },
            {
                acronym: 'AP',
                name: 'Amapá'
            },
            {
                acronym: 'BA',
                name: 'Bahia'
            },
            {
                acronym: 'CE',
                name: 'Ceará'
            },
            {
                acronym: 'DF',
                name: 'Distrito Federal'
            },
            {
                acronym: 'ES',
                name: 'Espírito Santo'
            },
            {
                acronym: 'GO',
                name: 'Goiás'
            },
            {
                acronym: 'MA',
                name: 'Maranhão'
            },
            {
                acronym: 'MG',
                name: 'Minas Gerais'
            },
            {
                acronym: 'MS',
                name: 'Mato Grosso do Sul'
            },
            {
                acronym: 'MT',
                name: 'Mato Grosso'
            },
            {
                acronym: 'PA',
                name: 'Pará'
            },
            {
                acronym: 'PB',
                name: 'Paraíba'
            },
            {
                acronym: 'PE',
                name: 'Pernambuco'
            },
            {
                acronym: 'PI',
                name: 'Piauí'
            },
            {
                acronym: 'PR',
                name: 'Paraná'
            },
            {
                acronym: 'RJ',
                name: 'Rio de Janeiro'
            },
            {
                acronym: 'RN',
                name: 'Rio Grande do Norte'
            },
            {
                acronym: 'RO',
                name: 'Rondônia'
            },
            {
                acronym: 'RR',
                name: 'Roraima'
            },
            {
                acronym: 'RS',
                name: 'Rio Grande do Sul'
            },
            {
                acronym: 'SC',
                name: 'Santa Catarina'
            },
            {
                acronym: 'SE',
                name: 'Sergipe'
            },
            {
                acronym: 'SP',
                name: 'São Paulo'
            },
            {
                acronym: 'TO',
                name: 'Tocantins'
            },
        ]);

        // ---------------------------------------------------

        const userFactory = await factoryManager.get(Uf);
        // save 1 factory generated entity, to the database
        await userFactory.save();

        // save 5 factory generated entities, to the database
        await userFactory.saveMany(5);
    }
}
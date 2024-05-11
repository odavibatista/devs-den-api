import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
      ): Promise<any> {
        const repository = dataSource.getRepository(User)

        const users = [
            {
                email: "fulano@gmail.com",
                password: "@Fulano1234567DaSilva",
                role: "candidate"
            },

            {
                email: "ciclano@gmail.com",
                password: "@Ciclano1234567DaSilva",
                role: "candidate"
            },

            {
                email: "administrador@cocacola.com.br",
                password: "@CocaCola1234567Empresa",
                role: "company"
            },

            {
                email: "administrador@pepsico.com.br",
                password: "@PepsiCo1234567Empresa",
                role: "company"
            },
        ]

        const newUsers = await repository.create(users);
        await repository.save(newUsers);
      }
}
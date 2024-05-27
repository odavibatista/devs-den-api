import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Uf } from '../entity/uf.entity';
import ufs from './uf.sample';

export default class UfSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Uf);
    // ---------------------------------------------------

    const newUfs = await repository.create(ufs);
    await repository.save(newUfs);
  }
}

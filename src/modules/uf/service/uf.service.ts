import { Injectable } from '@nestjs/common';
import { Uf } from '../entity/uf.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUFsResponseDTO } from '../domain/requests/FindUfs.request.dto';

@Injectable()
export class UfService {
  constructor(
    @InjectRepository(Uf)
    private skillRepository: Repository<Uf>,
  ) {}

  async findAll(): Promise<FindUFsResponseDTO> {
    const ufs = await this.skillRepository.find();

    const response = ufs.map((uf) => {
      return {
        id_uf: uf.id_uf,
        name: uf.name,
        acronym: uf.acronym,
      };
    });

    return response;
  }
}

import { Injectable } from '@nestjs/common';
import { Uf } from '../entity/uf.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UfService {
  constructor(
    @InjectRepository(Uf)
    private skillRepository: Repository<Uf>,
  ) {}

  async findAll(): Promise<Uf[]> {
    return await this.skillRepository.find();
  }
}

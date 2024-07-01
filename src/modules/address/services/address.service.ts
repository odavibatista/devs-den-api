import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entity/address.entity';
import { Repository } from 'typeorm';
import { Uf } from '../../uf/entity/uf.entity';
import { CreateAddressRequestDTO } from '../domain/requests/CreateAddress.request.dto';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        @InjectRepository(Uf)
        private readonly ufRepository: Repository<Uf>,
    )   {}

    async create(address: CreateAddressRequestDTO): Promise<Address> {
        return await this.addressRepository.save(address);
    }
}

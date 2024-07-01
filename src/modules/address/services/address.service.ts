import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entity/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressRequestDTO } from '../domain/requests/CreateAddress.request.dto';
import { AddressNotFoundException } from '../domain/errors/AddressNotFound.exception.dto';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>
    )   {}

    async create(address: CreateAddressRequestDTO): Promise<Address> {
        return await this.addressRepository.save(address);
    }

    async delete(id: number): Promise<void | AddressNotFoundException> {
        await this.addressRepository.update(      
            { id_address: id },
            {
              deleted_at: new Date().toISOString(),
            },
        )
    }
}

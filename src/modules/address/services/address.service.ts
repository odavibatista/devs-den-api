import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entity/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressRequestDTO } from '../domain/requests/CreateAddress.request.dto';
import { AddressNotFoundException } from '../domain/errors/AddressNotFound.exception.dto';
import { FindAddressResponseDTO } from '../domain/requests/FindAddress.request.dto';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>
    )   {}

    async findOne(id: number): Promise<FindAddressResponseDTO | AddressNotFoundException> {
        const address = await this.addressRepository.findOne({
            where: { id_address: id }
        });

        if (!address) {
            throw new AddressNotFoundException();
        }

        return address;
    }

    async create(address: CreateAddressRequestDTO): Promise<Address> {
        return await this.addressRepository.save(address);
    }

    async edit(id: number, address: CreateAddressRequestDTO): Promise<Address | AddressNotFoundException> {
        await this.findOne(id);

        await this.addressRepository.update(
            { id_address: id },
            {
                ...address
            }
        )

        return await this.addressRepository.findOne({
            where: { id_address: id }
        });
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

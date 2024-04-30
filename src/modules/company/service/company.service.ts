import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Companies } from '../entity/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDTO } from '../dto/company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Companies)
        private companyRepository: Repository<Companies>,
    )   {}

    async findAll (): Promise<Companies[]>  {
        return await this.companyRepository.find({})
    }

    async findOne (id: number): Promise<Companies>    {
        const company = await this.companyRepository.findOne({
            where:  { id_company: id}
        })

        if  (!company) {
            throw new HttpException(`Empresa não encontrada.`, HttpStatus.NOT_FOUND)
        }

        return company
    }

    async create    (createCompanyDto: CreateCompanyDTO): Promise<Companies> {
        try {
            const companyWithSameName = await this.companyRepository.findOne({
                where: { name: createCompanyDto.company_name }
            })

            if (companyWithSameName) throw new HttpException(`Uma empresa com este nome já existe. Insira outro ou entre em contato com o nosso suporte.`, HttpStatus.CONFLICT)

            const companyWithSamePJ = await this.companyRepository.findOne({
                where: { cnpj: createCompanyDto.cnpj }
            })

            if (companyWithSamePJ) throw new HttpException(`Este CNPJ já está cadastrado. Insira outro ou entre em contato com o nosso suporte.`, HttpStatus.CONFLICT)

            const createdCompany = await this.companyRepository.save(createCompanyDto)

            return createdCompany
        } catch (error) {
            console.log(error);
            
            throw new HttpException(
            'Erro ao criar o registro. Tente novamente mais tarde.',
            HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

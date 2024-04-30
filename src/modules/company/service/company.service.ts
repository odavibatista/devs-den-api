import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entity/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDTO } from '../dto/company.dto';
import { CompanyNotFoundException } from '../domain/errors/CompanyNotFound.exception';
import { CompanyNameAlreadyRegisteredException } from '../domain/errors/CompanyNameAlreadyRegistered.exception';
import { CNPJAlreadyRegisteredException } from '../domain/errors/CNPJAlreadyRegistered.exception';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    )   {}

    async findAll (): Promise<Company[]>  {
        return await this.companyRepository.find()
    }

    async findOne (id: number): Promise<Company | Company>    {
        const company = await this.companyRepository.findOne({
            where:  { id_company: id}
        })

        return company
    }

    async create    (createCompanyDto: CreateCompanyDTO): Promise<Company> {
        try {
            const companyWithSameName = await this.companyRepository.findOne({
                where: { name: createCompanyDto.company_name }
            })

            if (companyWithSameName) throw new CompanyNameAlreadyRegisteredException()

            const companyWithSamePJ = await this.companyRepository.findOne({
                where: { cnpj: createCompanyDto.cnpj }
            })

            if (companyWithSamePJ) throw new CNPJAlreadyRegisteredException()

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
 
    // NEEDS TO BE FIXED, PROVISORY ONLY
    async delete    (id: number): Promise<Company>    {
        try {
            const company = this.companyRepository.findOne({ where: { id_company: id}})
            
            if (!company) throw new CompanyNotFoundException()

            await this.companyRepository.delete({
                id_company: id
            })

            return company

        } catch (error) {
            
        }
    }
}

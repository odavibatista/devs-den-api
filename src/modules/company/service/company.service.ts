import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entity/company.entity';
import { Repository } from 'typeorm';
import { CompanyNotFoundException } from '../domain/errors/CompanyNotFound.exception';
import { CompanyNameAlreadyRegisteredException } from '../domain/errors/CompanyNameAlreadyRegistered.exception';
import { CNPJAlreadyRegisteredException } from '../domain/errors/CNPJAlreadyRegistered.exception';
import { pjValidate } from 'src/shared/utils/pjValidate';
import { EmailAlreadyRegisteredException } from 'src/modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { User } from 'src/modules/user/entity/user.entity';
import { passwordValidate } from 'src/shared/utils/passwordValidate';
import { emailValidate } from 'src/shared/utils/emailValidate';
import { UnformattedPasswordException } from 'src/modules/user/domain/errors/UnformattedPassword.exception';
import { UnformattedEmailException } from 'src/modules/user/domain/errors/UnformattedEmail.exception';
import { InvalidCNPJException } from '../domain/errors/InvalidCNPJ.exception';
import { RegisterCompanyBodyDTO } from '../domain/requests/RegisterCompany.request.dto';
import { Address } from 'src/modules/address/entity/address.entity';
import { Uf } from 'src/modules/uf/entity/uf.entity';
import { UFNotFoundException } from 'src/modules/uf/domain/errors/UfNotFound.exception';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        @InjectRepository(Uf)
        private readonly ufRepository: Repository<Uf>,
    )   {}

    async findAll (): Promise<Company[]>  {
        return await this.companyRepository.find()
    }

    async findOne (id: number): Promise<Company | Company>    {
        const company = await this.companyRepository.findOne({
            where:  { id_user: id}
        })

        return company
    }

    async create    (params: RegisterCompanyBodyDTO): Promise<Company | EmailAlreadyRegisteredException | UnformattedPasswordException | CompanyNameAlreadyRegisteredException | CNPJAlreadyRegisteredException | InvalidCNPJException> {
        try {
            const userWithSameEmail = await this.userRepository.findOne({
                where: { email: params.credentials.email }
            })

            if (params.credentials.email.length < 8 || params.credentials.email.length > 50) throw new UnformattedEmailException()

            if (userWithSameEmail) throw new EmailAlreadyRegisteredException()

            if (!emailValidate(params.credentials.email)) throw new UnformattedEmailException()

            if (!passwordValidate(params.credentials.password)) throw new UnformattedPasswordException()

            const companyWithSameName = await this.companyRepository.findOne({
                where: { name: params.company_name }
            })

            if (companyWithSameName) throw new CompanyNameAlreadyRegisteredException()

            const companyWithSamePJ = await this.companyRepository.findOne({
                where: { cnpj: params.cnpj }
            })

            if (companyWithSamePJ) throw new CNPJAlreadyRegisteredException()

            const uf = await this.ufRepository.findOne({
                where: { id_uf: params.address.uf }
            })

            if (!uf) {
                throw new UFNotFoundException()
            }

            const isCNPJValid = pjValidate(params.cnpj)

            if (!isCNPJValid) throw new InvalidCNPJException()

            const user = await this.userRepository.save({
                email: params.credentials.email,
                password: params.credentials.password,
                role: 'company'
            })
            
            const address = await this.addressRepository.save({
                uf: uf,
                cep: params.address.cep,
                city: params.address.city,
                street: params.address.street,
                complement: params.address.complement,
                number: params.address.number,
            })

            const createdCompany = await this.companyRepository.save({
                id_user: user.id_user,
                name: params.company_name,
                cnpj: params.cnpj
            })

            return createdCompany
        } catch (error) {
            throw new HttpException(error, error.status)
        }
    }
 
    // NEEDS TO BE FIXED, PROVISORY ONLY
    async delete    (id: number): Promise<Company>    {
        try {
            const company = this.companyRepository.findOne({ where: { id_user: id}})
            
            if (!company) throw new CompanyNotFoundException()

            await this.companyRepository.delete({
                id_user: id
            })

            return company

        } catch (error) {
            throw new HttpException(error, error.status)
        }
    }
}

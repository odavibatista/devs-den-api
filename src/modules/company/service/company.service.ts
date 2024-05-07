import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entity/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDTO } from '../dto/company.dto';
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

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
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

    async create    (params: RegisterCompanyBodyDTO | CreateCompanyDTO): Promise<Company | EmailAlreadyRegisteredException | UnformattedPasswordException | CompanyNameAlreadyRegisteredException | CNPJAlreadyRegisteredException | InvalidCNPJException> {
        try {
            const userWithSameEmail = await this.userRepository.findOne({
                where: { email: params.credentials.email }
            })

            if (userWithSameEmail) throw new EmailAlreadyRegisteredException()

            if (!passwordValidate(params.credentials.password)) throw new UnformattedPasswordException()

            if (!emailValidate(params.credentials.email)) throw new UnformattedEmailException()

            const companyWithSameName = await this.companyRepository.findOne({
                where: { name: params.company_name }
            })

            if (companyWithSameName) throw new CompanyNameAlreadyRegisteredException()

            const companyWithSamePJ = await this.companyRepository.findOne({
                where: { cnpj: params.cnpj }
            })

            if (companyWithSamePJ) throw new CNPJAlreadyRegisteredException()

            const isCNPJValid = pjValidate(params.cnpj)

            if (!isCNPJValid) throw new InvalidCNPJException()

            const createdCompany = await this.companyRepository.save(params)

            return createdCompany
        } catch (error) {
            throw new HttpException(error, error.status)
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
            throw new HttpException(error, error.status)
        }
    }
}

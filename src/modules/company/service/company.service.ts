import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entity/company.entity';
import { Repository } from 'typeorm';
import { CompanyNotFoundException } from '../domain/errors/CompanyNotFound.exception';
import { CompanyNameAlreadyRegisteredException } from '../domain/errors/CompanyNameAlreadyRegistered.exception';
import { CNPJAlreadyRegisteredException } from '../domain/errors/CNPJAlreadyRegistered.exception';
import { pjValidate } from '../../../shared/utils/pjValidate';
import { EmailAlreadyRegisteredException } from '../../../modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { User } from '../../../modules/user/entity/user.entity';
import { passwordValidate } from '../../../shared/utils/passwordValidate';
import { emailValidate } from '../../../shared/utils/emailValidate';
import { UnformattedPasswordException } from '../../../modules/user/domain/errors/UnformattedPassword.exception';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';
import { InvalidCNPJException } from '../domain/errors/InvalidCNPJ.exception';
import {
  RegisterCompanyBodyDTO,
  RegisterCompanyResponseDTO,
} from '../domain/requests/RegisterCompany.request.dto';
import { Address } from '../../../modules/address/entity/address.entity';
import { Uf } from '../../../modules/uf/entity/uf.entity';
import { UFNotFoundException } from '../../../modules/uf/domain/errors/UfNotFound.exception';
import { JWTProvider } from '../../../modules/user/providers/JWT.provider';
import { UserService } from '../../../modules/user/service/user.service';
import { FindCompanyResponseDTO } from '../domain/requests/FindCompanies.request.dto';
import { NameTooShortException } from '../../user/domain/errors/NameTooShort.exception';
import { NameTooLongException } from '../../user/domain/errors/NameTooLong.exception';
import { nameValidate } from '../../../shared/utils/nameValidate';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { streetValidate } from '../../../shared/utils/streetValidate';
import { cepValidate } from '../../../shared/utils/cepValidate';
import { CityTooShortException } from '../../address/domain/errors/CityTooShort.exception';
import { CityTooLongException } from '../../address/domain/errors/CityTooLong.exception';

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
    private readonly JwtProvider: JWTProvider,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async findOne(
    id: number,
  ): Promise<FindCompanyResponseDTO | CompanyNotFoundException> {
    const company = await this.companyRepository.findOne({
      where: { id_user: id },
    });

    if (!company) throw new CompanyNotFoundException();
    else
      return {
        id_user: company.id_user,
        name: company.name,
        cnpj: company.cnpj,
      };
  }

  async create(
    params: RegisterCompanyBodyDTO,
  ): Promise<
    | RegisterCompanyResponseDTO
    | EmailAlreadyRegisteredException
    | UnformattedPasswordException
    | CompanyNameAlreadyRegisteredException
    | CNPJAlreadyRegisteredException
    | InvalidCNPJException
  > {
    try {
      if (params.company_name.length < 5) throw new NameTooShortException();

      if (params.company_name.length > 50) throw new NameTooLongException();

      if (!emailValidate(params.credentials.email))
        throw new UnformattedEmailException();

      if (!passwordValidate(params.credentials.password))
        throw new UnformattedPasswordException();

      if (!nameValidate(params.address.city))
        throw new UnprocessableDataException(
          'Cidades não podem conter números e caracteres especiais.',
        );

      if (!streetValidate(params.address.street))
        throw new UnprocessableDataException(
          'Ruas devem possuir entre 1 e 100 caracteres.',
        );

      if (!cepValidate(params.address.cep))
        throw new UnprocessableDataException('CEP inválido.');

      if (params.address.city.length < 3) throw new CityTooShortException();

      if (params.address.city.length > 50) throw new CityTooLongException();

      if (params.address.city.length < 1)
        throw new UnprocessableDataException(
          'Rua deve possuir pelo menos um caractere.',
        );

      if (params.address.city.length > 100)
        throw new UnprocessableDataException(
          'Rua não pode ter mais de 100 caracteres.',
        );

      if (params.address.number.length < 1)
        throw new UnprocessableDataException(
          'Número de endereço deve possuir pelo menos um caractere.',
        );

      if (params.address.number.length > 10)
        throw new UnprocessableDataException(
          'Número de endereço deve possuir pelo menos dez caracteres.',
        );

      const userWithSameEmail = await this.userRepository.findOne({
        where: { email: params.credentials.email },
      });

      if (
        params.credentials.email.length < 8 ||
        params.credentials.email.length > 50
      )
        throw new UnformattedEmailException();

      if (userWithSameEmail) throw new EmailAlreadyRegisteredException();

      const companyWithSameName = await this.companyRepository.findOne({
        where: { name: params.company_name },
      });

      if (companyWithSameName)
        throw new CompanyNameAlreadyRegisteredException();

      const companyWithSamePJ = await this.companyRepository.findOne({
        where: { cnpj: params.cnpj },
      });

      if (companyWithSamePJ) throw new CNPJAlreadyRegisteredException();

      const uf = await this.ufRepository.findOne({
        where: { id_uf: params.address.uf },
      });

      if (!uf) {
        throw new UFNotFoundException();
      }

      const isCNPJValid = pjValidate(params.cnpj);

      if (!isCNPJValid) throw new InvalidCNPJException();

      await this.userService.create({
        email: params.credentials.email,
        password: params.credentials.password,
        role: 'company',
      });

      const userToBeFound: User = await this.userRepository.findOne({
        where: { email: params.credentials.email },
      });

      await this.addressRepository.save({
        uf: uf,
        cep: params.address.cep,
        city: params.address.city,
        street: params.address.street,
        complement: params.address.complement,
        number: params.address.number,
      });

      await this.companyRepository.save({
        id_user: userToBeFound.id_user,
        name: params.company_name,
        cnpj: params.cnpj,
      });

      const token = this.JwtProvider.generate({
        payload: {
          id: userToBeFound.id_user,
          role: params.credentials.role,
        },
      });

      return {
        user: {
          id: userToBeFound.id_user,
          name: params.company_name,
          role: 'company',
        },
        token: token,
      };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async delete(id: number): Promise<string | CompanyNotFoundException> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id_user: id },
      });

      if (!company || company.deleted_at !== null)
        throw new CompanyNotFoundException();

      await this.companyRepository.update(
        { id_user: id },
        {
          deleted_at: new Date().toISOString(),
        },
      );

      return company.name;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}

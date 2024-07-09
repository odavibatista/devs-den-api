import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDTO } from '../dto/user.dto';
import { JWTProvider } from '../providers/JWT.provider';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../domain/errors/UnformattedPassword.exception';
import { WrongPasswordException } from '../domain/errors/WrongPassword.exception';
import {
  LoginUserBodyDTO,
  LoginUserResponseDTO,
} from '../domain/requests/LoginUser.request.dto';
import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Company } from '../../../modules/company/entity/company.entity';
import {
  FindCandidateUserResponseDTO,
  FindCompanyUserResponseDTO,
} from '../domain/requests/FindUser.request.dto';
import { HashProvider } from '../providers/hash.provider';
import { passwordValidate } from '../../../shared/utils/passwordValidate';
import { emailValidate } from '../../../shared/utils/emailValidate';
import { CreateUserResponseDTO } from '../domain/requests/CreateUser.request.dto';
import { PasswordTooLongException } from '../domain/errors/PasswordTooLong.exception';
import {
  GetCandidateProfileDataResponseDTO,
  GetCompanyProfileDataResponseDTO,
} from '../domain/requests/GetProfileData.request.dto';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { Address } from '../../address/entity/address.entity';
import { AddressService } from '../../address/services/address.service';
import { AddressNotFoundException } from '../../address/domain/errors/AddressNotFound.exception.dto';
import { FindAddressResponseDTO } from '../../address/domain/requests/FindAddress.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtProvider: JWTProvider,
    private hashProvider: HashProvider,
    private addressService: AddressService,
  ) {}

  async findAll(): Promise<User[] | UserNotFoundException> {
    const users = await this.userRepository.find({
      where: { deleted_at: null || undefined },
    });

    if (users.length === 0) throw new UserNotFoundException();
    else return users;
  }

  async getProfileData(
    id: number,
  ): Promise<
    | GetCandidateProfileDataResponseDTO
    | GetCompanyProfileDataResponseDTO
    | UserNotFoundException
  > {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
    });

    if (!user || user.deleted_at !== null) {
      throw new UserNotFoundException();
    }

    const address = await this.addressService.findOne(user.id_user)

    if (address instanceof AddressNotFoundException) {
      return
    }

    if (user.role === 'candidate') {
      const candidateUser = await this.candidateRepository.findOne({
        where: { id_user: user.id_user },
      });

      return {
        id: user.id_user,
        name: candidateUser.name,
        email: user.email,
        role: user.role,
        birth_date: candidateUser.birth_date,
        address: {
          uf: address.uf_id,
          city: address.city,
          cep: address.cep,
          street: address.street,
          number: address.number,
          complement: address.complement,
        },
      };
    }

    if (user.role === 'company') {
      const companyUser = await this.companyRepository.findOne({
        where: { id_user: user.id_user },
      });

      return {
        id: user.id_user,
        company_name: companyUser.name,
        email: user.email,
        role: user.role,
        cnpj: companyUser.cnpj,
        address: {
          uf: address.uf_id,
          city: address.city,
          cep: address.cep,
          street: address.street,
          number: address.number,
          complement: address.complement,
        },
      };
    }
  }

  async findOne(
    id: number,
  ): Promise<
    | FindCandidateUserResponseDTO
    | FindCompanyUserResponseDTO
    | UserNotFoundException
  > {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
    });

    if (!user || user.deleted_at !== null) {
      throw new UserNotFoundException();
    }

    let name: string;

    if (user.role === 'candidate') {
      const candidateUser = await this.candidateRepository.findOne({
        where: { id_user: user.id_user },
      });

      name = candidateUser.name;

      return {
        id: user.id_user,
        name: name,
        email: user.email,
        role: user.role,
      };
    }

    if (user.role === 'company') {
      const companyUser = await this.companyRepository.findOne({
        where: { id_user: user.id_user },
      });

      name = companyUser.name;

      return {
        id: user.id_user,
        name: name,
        email: user.email,
        role: user.role,
        cnpj: companyUser.cnpj,
      };
    }
  }

  async create(
    params: CreateUserDTO,
  ): Promise<
    | CreateUserResponseDTO
    | EmailAlreadyRegisteredException
    | UnformattedEmailException
    | UnformattedPasswordException
  > {
    const userWithSameEmail = await this.userRepository.findOne({
      where: {
        email: params.email,
      },
    });

    if (userWithSameEmail) throw new EmailAlreadyRegisteredException();

    if (
      !emailValidate(params.email) ||
      params.email.length > 50 ||
      params.email.length < 10
    )
      throw new UnformattedEmailException();

    if (!passwordValidate(params.password) || params.password.length < 15)
      throw new UnformattedPasswordException();

    if (params.password.length > 50) throw new PasswordTooLongException();

    const hashedPassword = await this.hashProvider.hash(params.password);

    const user = await this.userRepository.save({
      email: params.email,
      password: hashedPassword,
      role: params.role,
      deleted_at: null,
    });

    return {
      user: {
        email: user.email,
        role: user.role,
      },
      id: user.id_user,
    };
  }

  async login(
    loginDto: LoginUserBodyDTO,
  ): Promise<
    | LoginUserResponseDTO
    | UserNotFoundException
    | WrongPasswordException
    | UnformattedEmailException
  > {
    const user: User = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      return new UserNotFoundException();
    }

    const isPasswordValid: boolean = await this.hashProvider.compare(
      loginDto.inserted_password,
      user.password,
    );

    if (!isPasswordValid) {
      return new WrongPasswordException();
    } else {
      const token = this.jwtProvider.generate({
        payload: {
          id: user.id_user,
          role: user.role,
        },
        expiresIn: '6h',
      });

      let name: string;

      if (user.role === 'candidate') {
        const candidateUser = await this.candidateRepository.findOne({
          where: { id_user: user.id_user },
        });

        name = candidateUser.name;
      }

      if (user.role === 'company') {
        const companyUser = await this.companyRepository.findOne({
          where: { id_user: user.id_user },
        });

        name = companyUser.name;
      }

      const response = {
        user: {
          id: user.id_user,
          name: name,
          role: user.role,
        },
        token: token,
      };
      return response;
    }
  }

  public async delete(id: number): Promise<number | UserNotFoundException> {
    const user = await this.userRepository.findOne({
      where: { id_user: id, deleted_at: null },
    });

    if (!user) throw new UserNotFoundException();

    user.deleted_at = new Date().toISOString();

    await this.userRepository.save(user);

    return user.id_user;
  }
}

export class UserClearingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async wipe(): Promise<void> {
    try {
      await this.userRepository.clear();
    } catch (error) {
      throw new CommonException(error);
    }
  }
}
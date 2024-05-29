import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Candidate } from '../entity/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../modules/user/entity/user.entity';
import { Address } from '../../../modules/address/entity/address.entity';
import {
  RegisterCandidateBodyDTO,
  RegisterCandidateResponseDTO,
} from '../domain/requests/RegisterCandidate.request.dto';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../../../modules/user/domain/errors/UnformattedPassword.exception';
import { EmailAlreadyRegisteredException } from '../../../modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { Uf } from '../../../modules/uf/entity/uf.entity';
import { UFNotFoundException } from '../../../modules/uf/domain/errors/UfNotFound.exception';
import { JWTProvider } from '../../../modules/user/providers/JWT.provider';
import { passwordValidate } from '../../../shared/utils/passwordValidate';
import { emailValidate } from '../../../shared/utils/emailValidate';
import { nameValidate } from '../../../shared/utils/nameValidate';
import { UserService } from '../../../modules/user/service/user.service';
import { CandidateNotFoundException } from '../domain/errors/CandidateNotFound.exception';
import { PasswordTooLongException } from '../../../modules/user/domain/errors/PasswordTooLong.exception';
import { NameTooShortException } from '../../../modules/user/domain/errors/NameTooShort.exception';
import { NameTooLongException } from '../../../modules/user/domain/errors/NameTooLong.exception';
import { UnformattedNameException } from '../../../modules/user/domain/errors/UnformattedName.exception';
import { CityTooShortException } from '../../../modules/address/domain/errors/CityTooShort.exception';
import { CityTooLongException } from '../../../modules/address/domain/errors/CityTooLong.exception';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Uf)
    private readonly ufRepository: Repository<Uf>,
    private readonly JwtProvider: JWTProvider,
    private readonly userService: UserService,
  ) {}

  async create(
    params: RegisterCandidateBodyDTO,
  ): Promise<
    | RegisterCandidateResponseDTO
    | NameTooShortException
    | NameTooLongException
    | UnformattedEmailException
    | UnformattedPasswordException
    | PasswordTooLongException
    | EmailAlreadyRegisteredException
  > {
      const name = params.name
      if (!nameValidate(name)) throw new UnformattedNameException()

      if (params.name.length < 5) throw new NameTooShortException()

      if (params.name.length > 50) throw new NameTooLongException()

      
      if (
        params.credentials.email.length < 8 ||
        params.credentials.email.length > 50
      )
        throw new UnformattedEmailException();

      if (params.address.city.length < 3) throw new CityTooShortException()

      if (params.address.city.length > 50) throw new CityTooLongException()


      const userWithSameEmail = await this.userRepository.findOne({
        where: { email: params.credentials.email },
      });

      if (userWithSameEmail) throw new EmailAlreadyRegisteredException();

      if (!emailValidate(params.credentials.email))
        throw new UnformattedEmailException();

      if (!passwordValidate(params.credentials.password))
        throw new UnformattedPasswordException();

      const uf = await this.ufRepository.findOne({
        where: { id_uf: params.address.uf },
      });

      if (!uf) {
        throw new UFNotFoundException();
      }

      await this.userService.create({
        email: params.credentials.email,
        password: params.credentials.password,
        role: 'candidate',
      });

      await this.addressRepository.save({
        uf: uf,
        cep: params.address.cep,
        city: params.address.city,
        street: params.address.street,
        complement: params.address.complement,
        number: params.address.number,
      });

      const userToBeFound: User = await this.userRepository.findOne({
        where: { email: params.credentials.email },
      });

      await this.candidateRepository.save({
        id_user: userToBeFound.id_user,
        name: params.name,
        gender: params.gender,
        birth_date: params.birth_date,
      });

      const token = this.JwtProvider.generate({
        payload: {
          id: userToBeFound.id_user,
          role: "candidate",
        },
      });

      const response = {
        user: {
          id: userToBeFound.id_user,
          name: params.name,
          role: 'candidate',
        },
        token: token,
      };

      return response;
  }

  async delete(id: number): Promise<string | CandidateNotFoundException> {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: { id_user: id, deleted_at: null },
      });

      if (!candidate) throw new CandidateNotFoundException();

      await this.candidateRepository.update(
        { id_user: id },
        {
          deleted_at: new Date().toISOString(),
        },
      );

      return candidate.name;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}

export class CandidateClearingService  {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>
  ) {}

  public async wipe(): Promise<void>  {
    try {
      await this.candidateRepository.clear();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
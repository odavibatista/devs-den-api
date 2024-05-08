import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Candidate } from '../entity/candidate.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { Address } from 'src/modules/address/entity/address.entity';
import {
  RegisterCandidateBodyDTO,
  RegisterCandidateResponseDTO,
} from '../domain/requests/RegisterCandidate.request.dto';
import { UnformattedEmailException } from 'src/modules/user/domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from 'src/modules/user/domain/errors/UnformattedPassword.exception';
import { EmailAlreadyRegisteredException } from 'src/modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { Uf } from 'src/modules/uf/entity/uf.entity';
import { UFNotFoundException } from 'src/modules/uf/domain/errors/UfNotFound.exception';
import { JWTProvider } from 'src/modules/user/providers/JWT.provider';
import { passwordValidate } from 'src/shared/utils/passwordValidate';
import { emailValidate } from 'src/shared/utils/emailValidate';
import { UserService } from 'src/modules/user/service/user.service';

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
    private readonly userService: UserService
  ) {}

  async create(
    params: RegisterCandidateBodyDTO,
  ): Promise<
    | RegisterCandidateResponseDTO
    | UnformattedEmailException
    | UnformattedPasswordException
    | EmailAlreadyRegisteredException
  > {
    try {
      if (
        params.credentials.email.length < 8 ||
        params.credentials.email.length > 50
      )
        throw new UnformattedEmailException();

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

      const user: User = await this.userService.create({
        email: params.credentials.email,
        password: params.credentials.password,
        role: 'candidate',
      })

      console.log(user)


      const address = await this.addressRepository.save({
        uf: uf,
        cep: params.address.cep,
        city: params.address.city,
        street: params.address.street,
        complement: params.address.complement,
        number: params.address.number,
      });

      const userToBeFound: User = await this.userRepository.findOne({
        where: { email: params.credentials.email },
      })

      const candidate = await this.candidateRepository.save({
        id_user: userToBeFound.id_user,
        name: params.name,
        gender: params.gender,
        birth_date: params.birth_date,
        address_id: (await address).id_address,
      });

      const token = this.JwtProvider.generate({
        payload: {
          id: userToBeFound.id_user,
          email: params.credentials.email,
          role: params.credentials.role
        }
      })

      const response = {
        user: {
          id: candidate.id_user,
          name: candidate.name,
          role: 'candidate',
        },
        token: token,
      };

      return response;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}

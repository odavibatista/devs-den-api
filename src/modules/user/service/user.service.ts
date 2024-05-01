import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDTO, LoginDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JWTProvider } from '../providers/JWT.provider';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../domain/errors/UnformattedPassword.exception';
import { WrongPasswordException } from '../domain/errors/WrongPassword.exception';
import { LoginUserBodyDTO } from '../domain/requests/LoginUser.request.dto';
import { Candidate } from 'src/modules/candidate/entity/candidate.entity';
import { Company } from 'src/modules/company/entity/company.entity';
import { FindUserResponseDTO } from '../domain/requests/FindUser.request.dto';

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
  ) {}
  
  async findAll (): Promise<User[] | UserNotFoundException> {
    const users = await this.userRepository.find()

    if (users.length === 0) throw new UserNotFoundException()

    else return users
  }

  async findOne (id: number): Promise<FindUserResponseDTO | UserNotFoundException> {
    const user = await this.userRepository.findOne({
      where: { id_login: id },
    });

    if (!user) {
      throw new UserNotFoundException()
    }

    let name: string

    if (user.role === 'candidate') {
      const candidateUser = await this.candidateRepository.findOne({
        where: { id_profile: user.id_login }
      })

      name = candidateUser.name
    }

    if (user.role === 'company') {
      const companyUser = await this.companyRepository.findOne({
        where: { id_company: user.id_login }
      })

      name = companyUser.name
    }

    return {
      id: user.id_login,
      email: user.email,
      name: name,
      role: user.role,
    }
  }

  async create  (createUserDto: CreateUserDTO): Promise<User | EmailAlreadyRegisteredException | UnformattedEmailException | UnformattedPasswordException> {
    try {
      const saltOrRounds = 10
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

      createUserDto.password = hash

      console.log(createUserDto.password)

      return await this.userRepository.save(
        this.userRepository.create(createUserDto),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new EmailAlreadyRegisteredException()
      } else {
        console.log(error);
        throw new HttpException(
          'Erro ao criar o registro. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async login (loginDto: LoginDTO | LoginUserBodyDTO): Promise<any> {
    const user: User = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.checkPassword(loginDto.inserted_password, user.password, (err, isSame) => {
      if (!isSame) {
        throw new WrongPasswordException()
      }

      if (err) {
        throw new HttpException('Erro ao verificar a senha.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return true
    });

    if (isPasswordValid === null) {
      throw new WrongPasswordException()
    } else  {
      const token = this.jwtProvider.generate({ payload: { id: user.id_login }, expiresIn: '6h', secret: process.env.JWT_SECRET });

      let name: string

      if (user.role === 'candidate') {
        const candidateUser = await this.candidateRepository.findOne({
          where: { id_profile: user.id_login }
        })

        name = candidateUser.name
      }

      if (user.role === 'company') {
        const companyUser = await this.companyRepository.findOne({
          where: { id_company: user.id_login }
        })

        name = companyUser.name
      }
      
      const response = {
        user: {
          id: user.id_login,
          name: name,
          role: user.role,
        },
        token
      }
      return response
    }
  }

  /* TO BE REMOVED */
  public async checkPassword (password: string, otherPassword: string, callbackfn: (err?: Error, isSame?: boolean) => void) {
    bcrypt.compare(password, otherPassword, (err, isSame) => {
      if (err) {
        callbackfn(err)
      } else {
        callbackfn(err, isSame)
      }
    });
}
}
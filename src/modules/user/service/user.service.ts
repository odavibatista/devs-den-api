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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtProvider: JWTProvider
  ) {}
  
  async findAll (): Promise<User[] | UserNotFoundException> {
    const users = await this.userRepository.find()

    if (users.length === 0) throw new UserNotFoundException()

    else return users
  }

  async findOne (id: number): Promise<User | UserNotFoundException> {
    const user = await this.userRepository.findOne({
      where: { id_login: id},
    });

    if (!user) {
      throw new UserNotFoundException()
    }

    return user;
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

  async login (loginDto: LoginDTO): Promise<any> {
    const user: User = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.checkPassword(loginDto.password, user.password, (err, isSame) => {
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

      
      const response = {
        user: {
          id: user.id_login,
          email: user.email,
          role: user.role
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

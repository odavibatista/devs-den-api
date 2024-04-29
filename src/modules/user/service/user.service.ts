
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDTO, LoginDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JWTProvider } from '../providers/JWT.provider';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtProvider: JWTProvider
  ) {}
  
  async findAll (): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne (id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_login: id},
    });

    if (!user) {
      throw new HttpException(`Usuário não encontrado.`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create  (createUserDto: CreateUserDTO): Promise<User> {
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
        throw new HttpException('Email já registrado.', HttpStatus.BAD_REQUEST);
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
      if (err) {
        throw new HttpException('Erro ao verificar a senha.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!isSame) {
        throw new HttpException('Senha inválida.', HttpStatus.UNAUTHORIZED);
      }

      return true
    });

    if (isPasswordValid === null) {
      throw new HttpException('Senha inválida.', HttpStatus.UNAUTHORIZED);
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

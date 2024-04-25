import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/user.entity';
import { CreateUserDTO, UserDTO, UpdatePasswordDTO } from '../dto/users.dto';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    
    async findAll(): Promise<Users[]> {
        return await this.userRepository.find({ relations: ['filiacoes'] });
    }

    async findOne(email: string): Promise<Users> {
        const user = await this.userRepository.findOne({
          where: { email: email }
        });
    
        if (!user) {
          throw new HttpException(`Usuário não encontrado.`, HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async create(createUserDTO: CreateUserDTO): Promise<Users> {
      try {
        return await this.userRepository.save(
          this.userRepository.create(createUserDTO),
        );
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new HttpException('Email já registrado.', HttpStatus.BAD_REQUEST);
        } else {
          throw new HttpException(
            'Erro ao criar o registro. Tente novamente mais tarde.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
}

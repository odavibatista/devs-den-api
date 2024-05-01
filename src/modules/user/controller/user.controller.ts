import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { CreateUserDTO, LoginDTO } from '../dto/user.dto';
  import { UserService } from '../service/user.service';
import { JWTProvider } from '../providers/JWT.provider';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { User } from '../entity/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../domain/errors/UnformattedPassword.exception';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { WrongPasswordException } from '../domain/errors/WrongPassword.exception';
import { RegisterCandidateBodyDTO, RegisterCandidateResponseDTO } from 'src/modules/candidate/domain/requests/RegisterCandidate.request.dto';
  
  @Controller('user')
  @ApiTags('Usuário')
  export class UserController {
    constructor(
      private readonly userService: UserService,
      private JwtProvider: JWTProvider
    ) {}
  
    @Get(':id')
    @ApiResponse({
      status: new UserNotFoundException().getStatus(),
      description: new UserNotFoundException().message,
      type: AllExceptionsFilterDTO
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Usuário encontrado com sucesso',
    })
    async findOne(@Param('id') id: number): Promise<User | UserNotFoundException> {
      return this.userService.findOne(id);
    }
  
    // Mover isso para o controller de candidato
    @Post('/register')
    @ApiResponse({
      status: new UnformattedEmailException().getStatus(),
      description: new UnformattedEmailException().message,
      type: AllExceptionsFilterDTO
    })
    @ApiResponse({
      status: new UnformattedPasswordException().getStatus(),
      description: new UnformattedPasswordException().message,
      type: AllExceptionsFilterDTO
    })
    @ApiResponse({
      status: new EmailAlreadyRegisteredException().getStatus(),
      description: new EmailAlreadyRegisteredException().message,
      type: AllExceptionsFilterDTO
    })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Usuário criado com sucesso',
      type: RegisterCandidateResponseDTO
    })

    // Change the DTO to match the register user body
    async create(@Body() body: RegisterCandidateBodyDTO, createUserDto: CreateUserDTO): Promise<any> {
      return this.userService.create(createUserDto);
    }

    @Post('login')
    @ApiResponse({
      status: new UserNotFoundException().getStatus(),
      description: new UserNotFoundException().message,
      type: AllExceptionsFilterDTO
    })
    @ApiResponse({
      status: new UnformattedEmailException().getStatus(),
      description: new UnformattedEmailException().message,
      type: AllExceptionsFilterDTO
    })
    @ApiResponse({
      status: new WrongPasswordException().getStatus(),
      description: new WrongPasswordException().message,
      type: AllExceptionsFilterDTO
    })
    async login(@Body() loginDto: LoginDTO): Promise<any> {
      return this.userService.login(loginDto);
    }
  }
  
  
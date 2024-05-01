import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Res,
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
import { LoginUserBodyDTO, LoginUserResponseDTO } from '../domain/requests/LoginUser.request.dto';
import { Response } from 'express';
  
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
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Usuário logado com sucesso',
      type: LoginUserResponseDTO
    })
    async login(
      @Res() res: Response,
      @Body() loginDto: LoginUserBodyDTO
    ): Promise<any> {
      const result = await this.userService.login(loginDto)

      return res.status(HttpStatus.OK).json(result);
    }
  }
  
  
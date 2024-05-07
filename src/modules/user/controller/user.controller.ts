import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Res,
  } from '@nestjs/common';
  import { UserService } from '../service/user.service';
import { JWTProvider } from '../providers/JWT.provider';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { User } from '../entity/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { WrongPasswordException } from '../domain/errors/WrongPassword.exception';
import { LoginUserBodyDTO, LoginUserResponseDTO } from '../domain/requests/LoginUser.request.dto';
import { Response } from 'express';
import { FindUserResponseDTO } from '../domain/requests/FindUser.request.dto';
import { LoginDTO } from '../dto/user.dto';
  
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
      type: FindUserResponseDTO
    })
    async findOne(
      @Param('id') id: number,
      @Res() res: Response
    ): Promise<FindUserResponseDTO | AllExceptionsFilterDTO> {
      const result = await this.userService.findOne(id);

      if (result instanceof HttpException)  {
        return res.status(result.getStatus()).json({
          message: result.message,
          status: result.getStatus(),
        })
      } else  {
        return res.status(HttpStatus.OK).json({
          user: {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role
          }
        })
      }
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
      @Body() body: LoginUserBodyDTO
    ): Promise<LoginUserResponseDTO | AllExceptionsFilterDTO> {
      try {
        const result = await this.userService.login(body)

        if (result instanceof HttpException)  {
          return res.status(result.getStatus()).json({
            message: result.message,
            status: result.getStatus(),
          })
        } else {
          return res.status(HttpStatus.OK).json(result)
        }
      } catch (error) {
        return error.getStatus()
      }
    }
  }
  
  
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
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { WrongPasswordException } from '../domain/errors/WrongPassword.exception';
import {
  LoginUserBodyDTO,
  LoginUserResponseDTO,
} from '../domain/requests/LoginUser.request.dto';
import { Response } from 'express';
import { FindUserResponseDTO } from '../domain/requests/FindUser.request.dto';
import { CompanyNotFoundException } from 'src/modules/company/domain/errors/CompanyNotFound.exception';
import { NotAuthenticatedException } from '../domain/errors/NotAuthenticated.exception';
import { BadTokenException } from '../domain/errors/BadToken.exception';
import { IGetUserAuthInfoRequest } from 'src/shared/utils/IGetUserAuthInfoRequest';
import { CompanyService } from 'src/modules/company/service/company.service';
import { CandidateService } from 'src/modules/candidate/service/candidate.service';

@Controller('user')
@ApiTags('Usuário')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly candidateService: CandidateService,
  ) {}

  @Get(':id/search')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: new UserNotFoundException().getStatus(),
    description: new UserNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado com sucesso',
    type: FindUserResponseDTO,
  })
  async findOne(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<FindUserResponseDTO | AllExceptionsFilterDTO> {
    const result = await this.userService.findOne(id);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(HttpStatus.OK).json({
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
        },
      });
    }
  }

  @Post('login')
  @ApiResponse({
    status: new UserNotFoundException().getStatus(),
    description: new UserNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnformattedEmailException().getStatus(),
    description: new UnformattedEmailException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new WrongPasswordException().getStatus(),
    description: new WrongPasswordException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário logado com sucesso',
    type: LoginUserResponseDTO,
  })
  async login(
    @Res() res: Response,
    @Body() body: LoginUserBodyDTO,
  ): Promise<LoginUserResponseDTO | AllExceptionsFilterDTO> {
      const result = await this.userService.login(body);

      if (result instanceof HttpException) {
        return res.status(result.getStatus()).json({
          message: result.message,
          status: result.getStatus(),
        });
      } else {
        return res.status(HttpStatus.OK).json(result);
      }
  }

  @Delete(':id/delete')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: new UserNotFoundException().getStatus(),
    description: new UserNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CompanyNotFoundException().getStatus(),
    description: new CompanyNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new BadTokenException().getStatus(),
    description: new BadTokenException().message,
    type: AllExceptionsFilterDTO,
  })
  
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
    type: FindUserResponseDTO, // -> needs to be fixed
  })
  @ApiBearerAuth('user-token')
  async delete(
    @Req() req: IGetUserAuthInfoRequest,
    @Res()  res: Response,
    @Param('id') id: number,
  ): Promise<any> {
      const user = req.user

      if (user.id !== id) {
        throw new NotAuthenticatedException()
      }

      if (user.role === 'company') {
        await this.userService.delete(id)

        await this.companyService.delete(id)

        return res.status(HttpStatus.NO_CONTENT).json()
      }

      if (user.role === 'candidate') {
        await this.userService.delete(id)

        await this.candidateService.delete(id)

        return res.status(HttpStatus.NO_CONTENT).json()
      }
  }
}

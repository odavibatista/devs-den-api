import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { UnformattedEmailException } from '../domain/errors/UnformattedEmail.exception';
import { WrongPasswordException } from '../domain/errors/WrongPassword.exception';
import {
  LoginUserBodyDTO,
  LoginUserResponseDTO,
} from '../domain/requests/LoginUser.request.dto';
import { Request, Response } from 'express';
import {
  FindCandidateUserResponseDTO,
  FindCompanyUserResponseDTO,
} from '../domain/requests/FindUser.request.dto';
import { CompanyNotFoundException } from '../../../modules/company/domain/errors/CompanyNotFound.exception';
import { NotAuthenticatedException } from '../domain/errors/NotAuthenticated.exception';
import { BadTokenException } from '../domain/errors/BadToken.exception';
import { CompanyService } from '../../../modules/company/service/company.service';
import { CandidateService } from '../../../modules/candidate/service/candidate.service';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { HomeDataResponseDTO } from '../domain/requests/HomeData.request.dto';

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
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: FindCandidateUserResponseDTO,
  })
  async findOne(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<
    | FindCandidateUserResponseDTO
    | FindCompanyUserResponseDTO
    | AllExceptionsFilterDTO
  > {
    const result = await this.userService.findOne(id);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json({
        user: result,
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
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO
  })
  @ApiResponse({
    status: new UnauthorizedException().getStatus(),
    description: new UnauthorizedException().message,
    type: AllExceptionsFilterDTO
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário logado com sucesso',
    type: LoginUserResponseDTO,
  })
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginUserBodyDTO,
  ): Promise<LoginUserResponseDTO | AllExceptionsFilterDTO> {
    if (req.user) throw new UnauthorizedException()

    const result = await this.userService.login(body);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }
  
  @ApiBearerAuth('user-token')
  @Get('home-data')
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO
  })
  @ApiResponse({
    status: 300,
    description: 'Dados trazidos com sucesso.',
    type: HomeDataResponseDTO
  })
  async homeData (
    @Req() req: Request,
    @Res() res: Response
  ): Promise<HomeDataResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
          message: new NotAuthenticatedException().message,
          status: new NotAuthenticatedException().getStatus()
      });
    }

    const result = await this.userService.findOne(user.id);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(300).json({
        user: {
          id: result.id,
          name: result.name,
          role: result.role,
        },
      });
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
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  async delete(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<{} | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      throw new NotAuthenticatedException();
    }

    if (user.id != id) {
      throw new BadTokenException();
    }

    if (user.role === 'company') {
      const deleteUser = await this.userService.delete(id);

      const deleteCompany = await this.companyService.delete(id);

      if (deleteUser instanceof HttpException) {
        return res.status(deleteUser.getStatus()).json({
          message: deleteUser.message,
          status: deleteUser.getStatus(),
        });
      }

      if (deleteCompany instanceof HttpException) {
        return res.status(deleteCompany.getStatus()).json({
          message: deleteCompany.message,
          status: deleteCompany.getStatus(),
        });
      }

      else return res.status(204).json();
    }

    if (user.role === 'candidate') {
      const deleteUser = await this.userService.delete(id);

      const deleteCandidate = await this.candidateService.delete(id);

      if (deleteUser instanceof HttpException) {
        return res.status(deleteUser.getStatus()).json({
          message: deleteUser.message,
          status: deleteUser.getStatus(),
        });
      }

      if (deleteCandidate instanceof HttpException) {
        return res.status(deleteCandidate.getStatus()).json({
          message: deleteCandidate.message,
          status: deleteCandidate.getStatus(),
        });
      }

      else return res.status(204).json();
    }
  }
}

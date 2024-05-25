import { Response } from 'express';
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
} from '@nestjs/common';
import { CompanyService } from '../service/company.service';
import { Company } from '../entity/company.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { BadTokenException } from '../../../modules/user/domain/errors/BadToken.exception';
import { NotAuthenticatedException } from '../../../modules/user/domain/errors/NotAuthenticated.exception';
import { FindCompaniesResponseDTO } from '../domain/requests/FindCompanies.request.dto';
import { CNPJAlreadyRegisteredException } from '../domain/errors/CNPJAlreadyRegistered.exception';
import { InvalidCNPJException } from '../domain/errors/InvalidCNPJ.exception';
import { EmailAlreadyRegisteredException } from '../../../modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from '../../../modules/user/domain/errors/UnformattedPassword.exception';
import {
  RegisterCompanyBodyDTO,
  RegisterCompanyResponseDTO,
} from '../domain/requests/RegisterCompany.request.dto';
import { CommonException } from '../../../shared/domain/errors/Common.exception';

@Controller('companies')
@ApiTags('Empresas')
export class ConjunctCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/browse')
  @ApiResponse({
    status: 200,
    description: 'Empresas encontradas com sucesso',
    type: FindCompaniesResponseDTO,
  })
  @ApiResponse({
    status: new BadTokenException().getStatus(),
    description: new BadTokenException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO
  })
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }
}

@Controller('company')
@ApiTags('Empresas')
export class IndividualCompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post('/register')
  @ApiResponse({
    status: new CNPJAlreadyRegisteredException().getStatus(),
    description: new CNPJAlreadyRegisteredException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new InvalidCNPJException().getStatus(),
    description: new InvalidCNPJException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new EmailAlreadyRegisteredException().getStatus(),
    description: new EmailAlreadyRegisteredException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnformattedEmailException().getStatus(),
    description: new UnformattedEmailException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnformattedPasswordException().getStatus(),
    description: new UnformattedPasswordException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO
  })
  @ApiResponse({
    status: 201,
    description: 'Empresa criada com sucesso',
    type: RegisterCompanyResponseDTO,
  })
  async create(
    @Res() res: Response,
    @Body() body: RegisterCompanyBodyDTO,
  ): Promise<RegisterCompanyResponseDTO | AllExceptionsFilterDTO> {
    const result = await this.companyService.create(body);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(201).json(result);
    }
  }
}

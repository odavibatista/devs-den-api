import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { CompanyService } from '../service/company.service';
import { Company } from '../entity/company.entity';
import { CompanyNotFoundException } from '../domain/errors/CompanyNotFound.exception';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import { BadTokenException } from 'src/modules/user/domain/errors/BadToken.exception';
import { NotAuthenticatedException } from 'src/modules/user/domain/errors/NotAuthenticated.exception';
import { DeleteCompanyResponseDTO } from '../domain/requests/DeleteCompany.request.dto';
import { FindCompaniesResponseDTO } from '../domain/requests/FindCompanies.request.dto';
import { FindCompanyResponseDTO } from '../domain/requests/FindCompanies.request.dto';
import { CNPJAlreadyRegisteredException } from '../domain/errors/CNPJAlreadyRegistered.exception';
import { InvalidCNPJException } from '../domain/errors/InvalidCNPJ.exception';
import { EmailAlreadyRegisteredException } from 'src/modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { UnformattedEmailException } from 'src/modules/user/domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from 'src/modules/user/domain/errors/UnformattedPassword.exception';
import { CreateCompanyDTO } from '../dto/company.dto';
import { Response } from 'express';
import { RegisterCompanyBodyDTO, RegisterCompanyResponseDTO } from '../domain/requests/RegisterCompany.request.dto';


@Controller('companies')
@ApiTags('Empresas')
export class ConjunctCompanyController {
    constructor(
        private readonly companyService: CompanyService
    )   {}

    @Get('/browse')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Empresas encontradas com sucesso',
        type: FindCompaniesResponseDTO
    })
    @ApiResponse({
        status: new BadTokenException().getStatus(),
        description: new BadTokenException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new NotAuthenticatedException().getStatus(),
        description: new NotAuthenticatedException().message,
        type: AllExceptionsFilterDTO
    })
    async findAll(): Promise<any[]> {
        return this.companyService.findAll()
    }
}

@Controller('company')
@ApiTags('Empresas')
export class IndividualCompanyController    {
    constructor(
        private readonly companyService: CompanyService
    )   {}
    @Post('/create')
    @ApiResponse({
        status: new CompanyNotFoundException().getStatus(),
        description: new CompanyNotFoundException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new CNPJAlreadyRegisteredException().getStatus(),
        description: new CNPJAlreadyRegisteredException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new InvalidCNPJException().getStatus(),
        description: new InvalidCNPJException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new EmailAlreadyRegisteredException().getStatus(),
        description: new EmailAlreadyRegisteredException().message,
        type: AllExceptionsFilterDTO
    })
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
        status: HttpStatus.CREATED,
        description: 'Empresa criada com sucesso',
        type: Company
    })
    async create(
        @Res() res: Response,
        @Body() body:  RegisterCompanyBodyDTO | CreateCompanyDTO): Promise<RegisterCompanyResponseDTO | AllExceptionsFilterDTO> {
        const result = await this.companyService.create(body)

        if (result instanceof HttpException)  {
            return res.status(result.getStatus()).json({
                message: result.message,
                status: result.getStatus(),
            })
        } else  {
            return res.status(HttpStatus.CREATED).json({
                user: {
                    id: result.id_company,
                    name: result.name,
                    role: 'company'
                }
                
                // token -> add this later
            })
        }
    }

    @Get(':id')
    @ApiResponse({
        status: new CompanyNotFoundException().getStatus(),
        description: new CompanyNotFoundException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Empresa encontrada com sucesso',
        type: FindCompanyResponseDTO
    })
    async findOne(@Param('id') id: number): Promise<Company | CompanyNotFoundException>    {
        return this.companyService.findOne(id)
    }

    @Delete(':company_id/delete')
    @ApiResponse({
        status: new CompanyNotFoundException().getStatus(),
        description: new CompanyNotFoundException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new BadTokenException().getStatus(),
        description: new BadTokenException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new NotAuthenticatedException().getStatus(),
        description: new NotAuthenticatedException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: 204,
        description: 'Empresa deletada com sucesso',
        type: DeleteCompanyResponseDTO
    })
    async delete(@Param('company_id') id: number): Promise<any>    {
        return this.companyService.delete(id)
    }
}
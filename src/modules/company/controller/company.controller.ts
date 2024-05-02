import { Controller, Delete, Get, HttpStatus, Param } from '@nestjs/common';
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
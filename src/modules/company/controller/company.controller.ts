import { Controller, Delete, Get, HttpStatus, Param } from '@nestjs/common';
import { CompanyService } from '../service/company.service';
import { Company } from '../entity/company.entity';
import { CompanyNotFoundException } from '../domain/errors/CompanyNotFound.exception';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';


@Controller('companies')
@ApiTags('Empresas')
export class ConjunctCompanyController {
    constructor(
        private readonly companyService: CompanyService
    )   {}

    @Get('/browse')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Empresas encontradas com sucesso'
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
        description: 'Empresa encontrada com sucesso'
    })
    async findOne(@Param('id') id: number): Promise<Company | CompanyNotFoundException>    {
        return this.companyService.findOne(id)
    }

    @Delete(':company_id/delete')
    async delete(@Param(':company_id') id: number): Promise<any>    {
        return this.companyService.delete(id)
    }
}
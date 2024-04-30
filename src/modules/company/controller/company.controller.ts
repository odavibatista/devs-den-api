import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CompanyService } from '../service/company.service';


@Controller('companies')
export class ConjunctCompanyController {
    constructor(
        private readonly companyService: CompanyService
    )   {}

    @Get('/browse')
    async findAll(): Promise<any[]> {
        return this.companyService.findAll()
    }
}

@Controller('company')
export class IndividualCompanyController    {
    constructor(
        private readonly companyService: CompanyService
    )   {}

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<any>    {
        return this.companyService.findOne(id)
    }

    @Delete(':company_id/delete')
    async delete(@Param(':company_id') id: number): Promise<any>    {
        return this.companyService.delete(id)
    }
}
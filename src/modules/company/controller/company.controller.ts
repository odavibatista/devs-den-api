import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from '../service/company.service';

@Controller('company')
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService
    )   {}

    @Get()
    async findAll(): Promise<any[]> {
        return this.companyService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<any>    {
        return this.companyService.findOne(id)
    }
}

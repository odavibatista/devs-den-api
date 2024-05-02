import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UfService } from '../service/uf.service';
import { UFNotFoundException } from '../domain/errors/UfNotFound.exception';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';

@Controller('ufs')
@ApiTags('UFs')
export class UfController {
    constructor(
        private readonly ufService: UfService
    ) {}

    @Get()
    @ApiResponse({
        status: new UFNotFoundException().getStatus(),
        description: new UFNotFoundException().message,
        type: AllExceptionsFilterDTO
    })
    async findAll(): Promise<any> {
        return await this.ufService.findAll();
    }
}

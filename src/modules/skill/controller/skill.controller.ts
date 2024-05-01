import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { SkillService } from '../service/skill.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkillNotFoundException } from '../domain/errors/SkillNotFound.exception';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';

@Controller('skills')
@ApiTags('Skills')
export class ConjunctSkillController {
    constructor(
        private readonly skillService: SkillService
    )   {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skills encontradas com sucesso'
    })
    async findAll(): Promise<any[]> {
        return this.skillService.findAll()
    }
}

@Controller('skill')
@ApiTags('Skills')
export class IndividualSkillController {
    constructor(
        private readonly skillService: SkillService
    )   {}

    @Get(':id')
    @ApiResponse({
        status: new SkillNotFoundException().getStatus(),
        description: new SkillNotFoundException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skill encontrada com sucesso'
    })
    async findOne(@Param('id') id: number): Promise<any>    {
        return this.skillService.findOne(id)
    }
}

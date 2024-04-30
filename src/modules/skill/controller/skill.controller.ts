import { Controller, Get, Param } from '@nestjs/common';
import { SkillService } from '../service/skill.service';

@Controller('skills')
export class ConjunctSkillController {
    constructor(
        private readonly skillService: SkillService
    )   {}

    @Get()
    async findAll(): Promise<any[]> {
        return this.skillService.findAll()
    }
}

@Controller('skill')
export class IndividualSkill {
    constructor(
        private readonly skillService: SkillService
    )   {}

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<any>    {
        return this.skillService.findOne(id)
    }
}

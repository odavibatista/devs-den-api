import {
  Controller,
  Get,
  HttpStatus,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { SkillService } from '../service/skill.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkillNotFoundException } from '../domain/errors/SkillNotFound.exception';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import {
  FindSkillResponseDTO,
  FindSkillsResponseDTO,
} from '../domain/requests/FindSkills.request.dto';
import { Skill } from '../entity/skill.entity';
import { BadTokenException } from 'src/modules/user/domain/errors/BadToken.exception';

@Controller('skills')
@ApiTags('Skills')
export class ConjunctSkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skills encontradas com sucesso.',
    type: FindSkillsResponseDTO,
  })
  async findAll(): Promise<Skill[]> {
    return this.skillService.findAll();
  }
}

@Controller('skill')
@ApiTags('Skills')
export class IndividualSkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get(':id')
  @ApiResponse({
    status: new SkillNotFoundException().getStatus(),
    description: new SkillNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new BadTokenException().getStatus(),
    description: new BadTokenException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnauthorizedException().getStatus(),
    description: new UnauthorizedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill encontrada com sucesso',
    type: FindSkillResponseDTO,
  })
  async findOne(@Param('id') id: number): Promise<Skill> {
    return this.skillService.findOne(id);
  }
}

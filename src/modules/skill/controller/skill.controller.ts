import {
  Controller,
  Get,
  HttpException,
  Param,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SkillService } from '../service/skill.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkillNotFoundException } from '../domain/errors/SkillNotFound.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import {
  FindSkillResponseDTO,
  FindSkillsResponseDTO,
} from '../domain/requests/FindSkills.request.dto';
import { BadTokenException } from '../../../modules/user/domain/errors/BadToken.exception';
import { Request, Response } from 'express';
import { CommonException } from '../../../shared/domain/errors/Common.exception';

@Controller('skills')
@ApiTags('Skills')
export class ConjunctSkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Skills encontradas com sucesso.',
    type: FindSkillsResponseDTO,
  })
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<FindSkillsResponseDTO | AllExceptionsFilterDTO> {
    const result = await this.skillService.findAll();

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
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
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Skill encontrada com sucesso',
    type: FindSkillResponseDTO,
  })
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<FindSkillResponseDTO | AllExceptionsFilterDTO> {
    const result = await this.skillService.findAll();

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }
}

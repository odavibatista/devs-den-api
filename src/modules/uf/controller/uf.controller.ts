import { Controller, Get, HttpException, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UfService } from '../service/uf.service';
import { UFNotFoundException } from '../domain/errors/UfNotFound.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { FindUFsResponseDTO } from '../domain/requests/FindUfs.request.dto';
import { Response } from 'express';

@Controller('ufs')
@ApiTags('UFs')
export class UfController {
  constructor(private readonly ufService: UfService) {}

  @Get()
  @ApiResponse({
    status: new UFNotFoundException().getStatus(),
    description: new UFNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'UFs encontradas',
    type: FindUFsResponseDTO,
  })
  async findAll(
    @Res() res: Response,
  ): Promise<FindUFsResponseDTO | AllExceptionsFilterDTO> {
    const result = await this.ufService.findAll();

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

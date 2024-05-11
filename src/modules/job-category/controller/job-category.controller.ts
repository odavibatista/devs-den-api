import { Controller, Get, HttpException, Param, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FindJobCategoriesResponseDTO,
  FindJobCategoryResponseDTO,
} from '../domain/requests/FindJobCategories.request.dto';
import { JobCategoryService } from '../service/job-category.service';
import { CategoryNotFoundException } from '../domain/errors/CategoryNotFound.exception';
import { Request, Response } from 'express';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';

@Controller('job-category')
@ApiTags('Categorias de Emprego')
export class JobCategoryController {
  constructor(private readonly jobCategoriesService: JobCategoryService) {}
  @Get('/browse')
  @ApiResponse({
    status: new CategoryNotFoundException().getStatus(),
    description: new CategoryNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Categorias de emprego encontradas com sucesso',
    type: FindJobCategoriesResponseDTO,
  })
  async findAll(
    @Res() res: Response,
  ): Promise<
    | FindJobCategoriesResponseDTO
    | AllExceptionsFilterDTO
  > {
    const result = await this.jobCategoriesService.findAll();

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }

  @ApiResponse({
    status: new CategoryNotFoundException().getStatus(),
    description: new CategoryNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria de emprego encontrada com sucesso',
    type: FindJobCategoryResponseDTO,
  })
  @ApiBearerAuth('user-token')
  @Get(':id/find')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<
    | FindJobCategoryResponseDTO
    | AllExceptionsFilterDTO
  > {
    const result = await this.jobCategoriesService.findOne(id);

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

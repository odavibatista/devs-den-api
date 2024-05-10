import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindJobCategoriesResponseDTO, FindJobCategoryResponseDTO } from '../domain/requests/FindJobCategories.request.dto';
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
        status: HttpStatus.NOT_FOUND,
        description: new CategoryNotFoundException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Categorias de emprego encontradas com sucesso',
        type: FindJobCategoriesResponseDTO,
    })
    async findAll(
        @Res() res: Response,
    ): Promise<FindJobCategoriesResponseDTO | CategoryNotFoundException | AllExceptionsFilterDTO> {
        const result = await this.jobCategoriesService.findAll()

        if (result instanceof CategoryNotFoundException) {
            throw new CategoryNotFoundException()
        } else {
            return res.status(HttpStatus.OK).json(result)
        }
    }

    @ApiResponse({
        status: new CategoryNotFoundException().getStatus(),
        description: new CategoryNotFoundException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Categoria de emprego encontrada com sucesso',
        type: FindJobCategoryResponseDTO,
    })
    @ApiBearerAuth('user-token')
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<FindJobCategoryResponseDTO | CategoryNotFoundException> {
        const result = await this.jobCategoriesService.findOne(id)

        if (result instanceof CategoryNotFoundException) {
            throw new CategoryNotFoundException()
        } else {
            return result
        }
    }
}

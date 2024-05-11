import { Body, Controller, Get, HttpException, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobService } from '../service/job.service';
import { JobNotFoundException } from '../domain/errors/JobNotFound.exception';
import { Request, Response } from 'express';
import { FindJobResponseDTO, FindJobsResponseDTO } from '../domain/requests/FindJobs.request.dto';
import { UserIsNotCompanyException } from '../domain/errors/UserIsNotCompany.exception';
import { InvalidModalityException } from '../domain/errors/InvalidModality.exception';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import { CreateJobBodyDTO } from '../domain/requests/CreateJob.request.dto';
import { NotAuthenticatedException } from 'src/modules/user/domain/errors/NotAuthenticated.exception';

@Controller('jobs')
@ApiTags('Vagas')
export class ConjunctJobsController {
    constructor(private readonly jobService: JobService) {}

    @ApiResponse({
        status: new JobNotFoundException().getStatus(),
        description: new JobNotFoundException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: 200,
        description: 'Vagas encontradas com sucesso',
        type: FindJobsResponseDTO,
    })
    @Get('/browse')
    async findAll(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise <FindJobsResponseDTO | AllExceptionsFilterDTO> {
        const result = await this.jobService.findAll();

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
              message: result.message,
              status: result.getStatus(),
            });
          } else {
            return res.status(res.statusCode).json(result);
          }
    }
}
@ApiTags('Vagas')
@Controller('job')
export class IndividualJobController {
    constructor(private readonly jobService: JobService) {}

    @ApiBearerAuth('user-token')
    @ApiResponse({
        status: new JobNotFoundException().getStatus(),
        description: new JobNotFoundException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: 200,
        description: 'Vaga encontrada com sucesso',
        type: FindJobResponseDTO,
    })
    @Get('/:id/find')
    async findOne(
        @Param() id: number,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<FindJobResponseDTO | JobNotFoundException | AllExceptionsFilterDTO>  {
        const result = await this.jobService.findOne(id);

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
              message: result.message,
              status: result.getStatus(),
            });
          } else {
            return res.status(res.statusCode).json(result);
          }
    }

    @ApiResponse({
        status: new InvalidModalityException().getStatus(),
        description: new InvalidModalityException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: new UserIsNotCompanyException().getStatus(),
        description: new UserIsNotCompanyException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: 200,
        description: 'Vaga criada com sucesso!'
    })
    @Post('/create')
    async create(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: CreateJobBodyDTO,
    ): Promise<UserIsNotCompanyException | UnauthorizedException | AllExceptionsFilterDTO> {
        const user = req.user

        if (!user) {
            return res.status(new NotAuthenticatedException().getStatus()).json({
                message: new UnauthorizedException().message,
                status: new UnauthorizedException().getStatus()
            });
        }

        if (user.role !== 'company') {
            return res.status(new UserIsNotCompanyException().getStatus()).json({
                message: new UserIsNotCompanyException().message,
                status: new UserIsNotCompanyException().getStatus(),
            });
        }

        const result = await this.jobService.createJob(body, user.id);

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
              message: result.message,
              status: result.getStatus(),
            });
          } else {
            return res.status(res.statusCode).json(result);
          }
    }
}
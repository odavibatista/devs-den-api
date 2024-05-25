import { Body, Controller, Delete, Get, HttpException, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobService } from '../service/job.service';
import { JobNotFoundException } from '../domain/errors/JobNotFound.exception';
import { Request, Response } from 'express';
import { FindJobResponseDTO, FindJobsResponseDTO, SimpleFindJobResponseDTO } from '../domain/requests/FindJobs.request.dto';
import { UserIsNotCompanyException } from '../domain/errors/UserIsNotCompany.exception';
import { InvalidModalityException } from '../domain/errors/InvalidModality.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CreateJobBodyDTO } from '../domain/requests/CreateJob.request.dto';
import { NotAuthenticatedException } from '../../../modules/user/domain/errors/NotAuthenticated.exception';
import { UserIsNotCandidateException } from '../domain/errors/UserIsNotCandidate.exception';
import { AlreadyAppliedToJobException } from '../domain/errors/AlreadyAppliedToJob.exception';
import { JobHasBeenExpiredException } from '../domain/errors/JobHasBeenExpired.exception';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { JobApplicationService } from '../../../modules/job-applications/service/job-application.service';
import { GetJobStatusResponseDTO } from '../domain/requests/GetJobStatus.request.dto';

@Controller('jobs')
@ApiTags('Vagas')
export class ConjunctJobsController {
    constructor(private readonly jobService: JobService) {}

    @ApiResponse({
        status: 200,
        description: 'Vagas encontradas com sucesso',
        type: FindJobsResponseDTO,
    })
    @Get('/browse')
    async findAll(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise <SimpleFindJobResponseDTO[] | AllExceptionsFilterDTO> {
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
    constructor(
        private readonly jobApplicationService: JobApplicationService,
        private readonly jobService: JobService
    ) {}

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
        @Param('id') id: number,
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
    
    @ApiBearerAuth('user-token')
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

    @Post(':job_id/apply')
    @ApiBearerAuth('user-token')
    @ApiResponse({
        status: new CommonException().getStatus(),
        description: new CommonException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new AlreadyAppliedToJobException().getStatus(),
        description: new AlreadyAppliedToJobException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new JobHasBeenExpiredException().getStatus(),
        description: new JobHasBeenExpiredException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new JobNotFoundException().getStatus(),
        description: new JobNotFoundException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new NotAuthenticatedException().getStatus(),
        description: new NotAuthenticatedException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new AlreadyAppliedToJobException().getStatus(),
        description: new AlreadyAppliedToJobException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: new UserIsNotCandidateException().getStatus(),
        description: new UserIsNotCandidateException().message,
        type: AllExceptionsFilterDTO
    })
    @ApiResponse({
        status: 201,
        description: "Inscrição feita com sucesso.",
    })
    async applyToJob(
        @Param('job_id') jobId: number,
        @Req() req: Request,
        @Res() res: Response,
        // Add this type here later
    ): Promise <any | AllExceptionsFilterDTO>    {
        const user = req.user

        if (!user) {
            return res.status(new UnauthorizedException().getStatus()).json({
                message: new UnauthorizedException().message,
                status: new UnauthorizedException().getStatus()
            });
        }

        if (user.role !== 'candidate') {
            return res.status(new UserIsNotCandidateException().getStatus()).json({
                message: new UserIsNotCandidateException().message,
                status: new UserIsNotCandidateException().getStatus()
            });
        }

        const result = await this.jobApplicationService.applyToJob({
            candidate_id: user.id,
            job_id: jobId
        })

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
                message: result.message,
                status: result.getStatus()
            })
        }   else {
            return res.status(201).json({
                message: "Inscrição feita com sucesso.",
                status: 201
            })
        }
    }

    @Get('/:job_id/status')
    @ApiBearerAuth('user-token')
    @ApiResponse({
        status: new JobNotFoundException().getStatus(),
        description: new JobNotFoundException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: new UserIsNotCompanyException().getStatus(),
        description: new UserIsNotCompanyException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: new UnauthorizedException().getStatus(),
        description: new UnauthorizedException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: new NotAuthenticatedException().getStatus(),
        description: new NotAuthenticatedException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: 200,
        description: 'Dados da vaga encontrados com sucesso.',
        type: GetJobStatusResponseDTO,
    })
    async getJobStatus(
        @Param('job_id') jobId: number,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<GetJobStatusResponseDTO | AllExceptionsFilterDTO> {
        const user = req.user

        if (!user) {
            return res.status(new UnauthorizedException().getStatus()).json({
                message: new UnauthorizedException().message,
                status: new UnauthorizedException().getStatus()
            });
        }

        if (user.role !== 'company') {
            return res.status(new UserIsNotCompanyException().getStatus()).json({
                message: new UserIsNotCompanyException().message,
                status: new UserIsNotCompanyException().getStatus()
            });
        }

        const result = await this.jobService.getJobStatus(jobId, user.id)

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
                message: result.message,
                status: result.getStatus()
            })
        }   else {
            return res.status(res.statusCode).json(result)
        }
    }

    @Delete('/:job_id/remove')
    @ApiBearerAuth('user-token')
    @ApiResponse({
        status: new JobNotFoundException().getStatus(),
        description: new JobNotFoundException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: new UserIsNotCompanyException().getStatus(),
        description: new UserIsNotCompanyException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: new UnauthorizedException().getStatus(),
        description: new UnauthorizedException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: new NotAuthenticatedException().getStatus(),
        description: new NotAuthenticatedException().message,
        type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
        status: 204,
        description: 'Vaga removida com sucesso.',
    })
    async removeJob(
        @Param('job_id') jobId: number,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<AllExceptionsFilterDTO> {
        const user = req.user

        if (!user) {
            return res.status(new UnauthorizedException().getStatus()).json({
                message: new UnauthorizedException().message,
                status: new UnauthorizedException().getStatus()
            });
        }

        if (user.role !== 'company') {
            return res.status(new UserIsNotCompanyException().getStatus()).json({
                message: new UserIsNotCompanyException().message,
                status: new UserIsNotCompanyException().getStatus()
            });
        }

        const result = await this.jobService.deleteJob(jobId, user.id)

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
                message: result.message,
                status: result.getStatus()
            })
        }   else {
            return res.status(204).json({
                message: 'Vaga removida com sucesso.',
                status: 204
            })
        }
    }
}
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Post,
    Put,
    Req,
    Res,
    UnauthorizedException,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JobApplicationService } from '../service/job-application.service';
import { CommonException } from 'src/shared/domain/errors/Common.exception';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import { NotAuthenticatedException } from 'src/modules/user/domain/errors/NotAuthenticated.exception';
import { AlreadyAppliedToJobException } from 'src/modules/job/domain/errors/AlreadyAppliedToJob.exception';
import { UserIsNotCandidateException } from 'src/modules/job/domain/errors/UserIsNotCandidate.exception';
import { JobHasBeenExpiredException } from 'src/modules/job/domain/errors/JobHasBeenExpired.exception';
import { JobNotFoundException } from 'src/modules/job/domain/errors/JobNotFound.exception';

@Controller('job')
@ApiTags('Vagas')
export class JobApplicationController {
    constructor(
        private readonly jobApplicationService: JobApplicationService
    ) {}

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
        // Fix this later
        type: AllExceptionsFilterDTO
    })
    async applyToJob(
        @Param('job_id') jobId: number,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise <any | AllExceptionsFilterDTO>    {
        const user = req.user

        if (!user) {
            return res.status(new UserIsNotCandidateException().getStatus()).json({
                message: new UserIsNotCandidateException().message,
                status: new UserIsNotCandidateException().getStatus()
            });
        }

        if (user.role !== 'candidate') {
            return res.status(new UnauthorizedException().getStatus()).json({
                message: new UnauthorizedException().message,
                status: new UnauthorizedException().getStatus()
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
}

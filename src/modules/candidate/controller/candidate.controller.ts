import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CandidateService } from '../service/candidate.service';
import {
  RegisterCandidateBodyDTO,
  RegisterCandidateResponseDTO,
} from '../domain/requests/RegisterCandidate.request.dto';
import { UnformattedEmailException } from '../../../modules/user/domain/errors/UnformattedEmail.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { UnformattedPasswordException } from '../../../modules/user/domain/errors/UnformattedPassword.exception';
import { EmailAlreadyRegisteredException } from '../../../modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { Response, Request } from 'express';

@Controller('candidate')
@ApiTags('Candidatos')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post('/register')
  @ApiResponse({
    status: new UnformattedEmailException().getStatus(),
    description: new UnformattedEmailException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnformattedPasswordException().getStatus(),
    description: new UnformattedPasswordException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new EmailAlreadyRegisteredException().getStatus(),
    description: new EmailAlreadyRegisteredException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: RegisterCandidateResponseDTO,
  })
  async register(
    @Req() req: Request,
    @Body() body: RegisterCandidateBodyDTO,
    @Res() res: Response,
  ): Promise<RegisterCandidateResponseDTO | AllExceptionsFilterDTO> {
    if (req.user) throw new UnauthorizedException()

    const result = await this.candidateService.create(body);

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

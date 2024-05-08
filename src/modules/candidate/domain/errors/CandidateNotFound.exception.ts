import { HttpException, HttpStatus } from '@nestjs/common';

export class CandidateNotFoundException extends HttpException {
  constructor() {
    super('Candidato não encontrado.', HttpStatus.NOT_FOUND);
  }
}

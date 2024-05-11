import { HttpException } from '@nestjs/common';

export class CandidateNotFoundException extends HttpException {
  constructor() {
    super('Candidato não encontrado.', 404);
  }
}

import { HttpException } from '@nestjs/common';

export class AlreadyAppliedToJobException extends HttpException {
  constructor() {
    super('Você já se candidatou para esta vaga.', 403);
  }
}

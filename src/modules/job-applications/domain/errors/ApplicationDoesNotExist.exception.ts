import { HttpException } from '@nestjs/common';

export class ApplicationDoesNotExist extends HttpException {
  constructor() {
    super('Você não está candidatado nesta vaga.', 404);
  }
}

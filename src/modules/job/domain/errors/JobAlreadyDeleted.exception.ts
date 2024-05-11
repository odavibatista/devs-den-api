import { HttpException } from '@nestjs/common';

export class JobAlreadyDeletedException extends HttpException {
  constructor() {
    super('Vaga já foi excluída do sistema.', 404);
  }
}

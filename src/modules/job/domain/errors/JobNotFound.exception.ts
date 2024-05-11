import { HttpException } from '@nestjs/common';

export class JobNotFoundException extends HttpException {
  constructor() {
    super('Vaga não encontrada. Busque por outra.', 404);
  }
}

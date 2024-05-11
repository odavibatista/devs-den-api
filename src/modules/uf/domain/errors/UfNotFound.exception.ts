import { HttpException } from '@nestjs/common';

export class UFNotFoundException extends HttpException {
  constructor() {
    super('UF não encontrada.', 404);
  }
}

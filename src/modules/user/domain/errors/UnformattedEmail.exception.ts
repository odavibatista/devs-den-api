import { HttpException } from '@nestjs/common';

export class UnformattedEmailException extends HttpException {
  constructor() {
    super('E-mail com formato inválido.', 400);
  }
}
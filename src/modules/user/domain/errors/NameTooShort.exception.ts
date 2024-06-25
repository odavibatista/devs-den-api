import { HttpException } from '@nestjs/common';

export class NameTooShortException extends HttpException {
  constructor() {
    super('Seu nome precisa ter ao menos 5 caracteres.', 422);
  }
}

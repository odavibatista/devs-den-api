import { HttpException } from '@nestjs/common';

export class NameTooLongException extends HttpException {
  constructor() {
    super('Seu nome não pode ter mais de 50 caracteres.', 422);
  }
}
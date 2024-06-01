import { HttpException } from '@nestjs/common';

export class UnformattedNameException extends HttpException {
  constructor() {
    super('Seu nome deve conter somente letras.', 422);
  }
}
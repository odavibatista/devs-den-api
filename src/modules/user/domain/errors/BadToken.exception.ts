import { HttpException } from '@nestjs/common';

export class BadTokenException extends HttpException {
  constructor() {
    super('Token inválido.', 401);
  }
}
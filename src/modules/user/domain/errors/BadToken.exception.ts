import { HttpException, HttpStatus } from '@nestjs/common';

export class BadTokenException extends HttpException {
  constructor() {
    super('Token inválido.', HttpStatus.UNAUTHORIZED);
  }
}

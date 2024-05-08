import { HttpException, HttpStatus } from '@nestjs/common';

export class UnformattedEmailException extends HttpException {
  constructor() {
    super('E-mail com formato inválido.', HttpStatus.NOT_ACCEPTABLE);
  }
}

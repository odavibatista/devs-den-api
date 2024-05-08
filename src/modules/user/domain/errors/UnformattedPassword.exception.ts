import { HttpException, HttpStatus } from '@nestjs/common';

export class UnformattedPasswordException extends HttpException {
  constructor() {
    super('Sua senha é muito fraca. Insira outra.', HttpStatus.NOT_ACCEPTABLE);
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class UFNotFoundException extends HttpException {
  constructor() {
    super('UF não encontrada.', HttpStatus.NOT_FOUND);
  }
}

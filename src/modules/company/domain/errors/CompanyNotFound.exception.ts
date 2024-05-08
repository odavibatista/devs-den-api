import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyNotFoundException extends HttpException {
  constructor() {
    super(
      'A empresa que você buscou não foi encontrada.',
      HttpStatus.NOT_FOUND,
    );
  }
}

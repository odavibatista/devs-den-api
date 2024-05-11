import { HttpException } from '@nestjs/common';

export class UserIsNotCompanyException extends HttpException {
  constructor() {
    super(
      'Somente empresas podem cadastrar vagas no sistema.',
      401,
    );
  }
}

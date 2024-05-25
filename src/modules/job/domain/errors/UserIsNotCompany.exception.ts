import { HttpException } from '@nestjs/common';

export class UserIsNotCompanyException extends HttpException {
  constructor() {
    super(
      'Somente empresas podem utilizar este recurso.',
      401,
    );
  }
}

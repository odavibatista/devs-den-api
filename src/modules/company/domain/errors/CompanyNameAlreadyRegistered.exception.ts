import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyNameAlreadyRegisteredException extends HttpException {
  constructor() {
    super(
      'Uma empresa com este nome já está cadastrada. Insira outro.',
      HttpStatus.CONFLICT,
    );
  }
}

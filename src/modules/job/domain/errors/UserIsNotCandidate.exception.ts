import { HttpException } from '@nestjs/common';

export class UserIsNotCandidateException extends HttpException {
  constructor() {
    super(
      'Somente candidatos podem se cadastrar em vagas.',
      401,
    );
  }
}

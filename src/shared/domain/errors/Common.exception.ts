import { HttpException, HttpStatus } from '@nestjs/common';

export class CommonException extends HttpException {
  constructor(message?: string) {
    super(
      `Ocorreu um erro. ${message ?? ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

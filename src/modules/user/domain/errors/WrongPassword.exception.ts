import { HttpException } from '@nestjs/common';

export class WrongPasswordException extends HttpException {
  constructor() {
    super('Senha incorreta. Tente novamente.', 401);
  }
}
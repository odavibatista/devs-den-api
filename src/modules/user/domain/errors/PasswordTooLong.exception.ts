import { HttpException } from '@nestjs/common';

export class PasswordTooLongException extends HttpException {
  constructor() {
    super('Sua senha excede o limite de 50 caracteres. Insira outra.', 422);
  }
}

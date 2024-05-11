import { HttpException } from '@nestjs/common';

export class UserAlreadyHasSkillException extends HttpException {
  constructor() {
    super('Usuário não encontrado.', 405);
  }
}

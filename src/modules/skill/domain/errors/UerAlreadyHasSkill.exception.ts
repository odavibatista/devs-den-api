import { HttpException, HttpStatus } from '@nestjs/common'

export class UserAlreadyHasSkillException extends HttpException {
  constructor() {
    super('Usuário não encontrado.', HttpStatus.CONFLICT)
  }
}
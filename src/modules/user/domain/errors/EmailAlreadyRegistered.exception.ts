import { HttpException, HttpStatus } from '@nestjs/common'

export class EmailAlreadyRegisteredException extends HttpException {
  constructor() {
    super('Este e-mail já está associado a uma conta.', HttpStatus.NOT_FOUND)
  }
}
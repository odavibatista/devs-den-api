import { HttpException, HttpStatus } from '@nestjs/common'

export class UserIsNotCompanyException extends HttpException {
  constructor() {
    super('Somente empresas podem cadastrar vagas no sistema.', HttpStatus.UNAUTHORIZED)
  }
}
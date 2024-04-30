import { HttpException, HttpStatus } from '@nestjs/common'

export class NotAuthenticatedException extends HttpException {
  constructor() {
    super('Você precisa estar logado para realizar esta ação.', HttpStatus.UNAUTHORIZED)
  }
}
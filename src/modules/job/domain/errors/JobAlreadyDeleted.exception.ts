import { HttpException, HttpStatus } from '@nestjs/common'

export class JobAlreadyDeletedException extends HttpException {
  constructor() {
    super('Vaga já foi excluída do sistema.', HttpStatus.NOT_FOUND)
  }
}
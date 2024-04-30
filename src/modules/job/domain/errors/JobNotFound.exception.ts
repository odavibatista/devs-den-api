import { HttpException, HttpStatus } from '@nestjs/common'

export class JobNotFoundException extends HttpException {
  constructor() {
    super('Vaga não encontrada. Busque por outra.', HttpStatus.NOT_FOUND)
  }
}
import { HttpException, HttpStatus } from '@nestjs/common'

export class UnprocessableDataException extends HttpException {
  constructor(message?: string) {
    super(`Erro de validação de dados. ${message ?? ''}`, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
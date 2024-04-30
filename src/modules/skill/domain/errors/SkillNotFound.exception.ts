import { HttpException, HttpStatus } from '@nestjs/common'

export class SkillNotFoundException extends HttpException {
  constructor() {
    super('Habilidade não encontrada. Selecione outra.', HttpStatus.NOT_FOUND)
  }
}
import { HttpException } from '@nestjs/common';

export class SkillNotFoundException extends HttpException {
  constructor() {
    super('Habilidade não encontrada. Selecione outra.', 404);
  }
}

import { HttpException } from '@nestjs/common';

export class InvalidModalityException extends HttpException {
  constructor() {
    super(
      'Modalidade inválida. Insira uma modalidade entre: híbrida, presencial e remota.',
      404,
    );
  }
}

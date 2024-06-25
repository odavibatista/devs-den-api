import { HttpException } from '@nestjs/common';

export class CityTooLongException extends HttpException {
  constructor() {
    super(
      'Nomes de cidades devem possuir no máximo cinquenta caracteres.',
      422,
    );
  }
}

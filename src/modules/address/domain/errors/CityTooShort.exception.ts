import { HttpException } from '@nestjs/common';

export class CityTooShortException extends HttpException {
  constructor() {
    super('Nomes de cidades devem possuir pelo menos três caracteres.', 422);
  }
}

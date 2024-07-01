import { HttpException } from '@nestjs/common';

export class AddressNotFoundException extends HttpException {
  constructor() {
    super('Endereço não encontrado.', 404);
  }
}

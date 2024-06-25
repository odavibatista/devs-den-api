import { HttpException } from '@nestjs/common';

export class CNPJAlreadyRegisteredException extends HttpException {
  constructor() {
    super('Uma empresa com este CNPJ já está cadastrada. Insira outro.', 400);
  }
}

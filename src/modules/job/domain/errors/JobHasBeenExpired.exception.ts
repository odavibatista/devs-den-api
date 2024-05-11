import { HttpException } from '@nestjs/common';

export class JobHasBeenExpiredException extends HttpException {
  constructor() {
    super('O período de inscrição dessa vaga expirou.', 423);
  }
}

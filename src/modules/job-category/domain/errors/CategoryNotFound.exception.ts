import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor() {
    super(
      'A categoria que você buscou não foi encontrada.',
      HttpStatus.NOT_FOUND,
    );
  }
}

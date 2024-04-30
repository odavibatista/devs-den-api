import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidCNPJException extends HttpException {
    constructor() {
        super("CNPJ em formato inválido. Insira um CNPJ no formato 'XX.XXX.XXX/XXXX-XX'.", HttpStatus.NOT_ACCEPTABLE)
    }
}
import { IsString, Length } from "class-validator";

export class CreateCompanyDTO {
    @IsString()
    @Length(5, 50)
    readonly company_name: string

    @IsString()
    @Length(16, 16)
    readonly cnpj: string
}

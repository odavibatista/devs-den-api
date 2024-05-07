import { IsNumber, IsString, Length } from "class-validator";
import { CreateAddressDTO } from "src/modules/user/dto/address.dto";
import { CreateUserDTO } from "src/modules/user/dto/user.dto";
import { Unique } from "typeorm";

export class CompanyDTO {
    @IsString()
    @Length(5, 50)
    readonly name: string

    @IsString()
    @Length(16, 16)
    readonly cnpj: string
}

export class CreateCompanyDTO   {
    @IsString()
    @Length(5, 50)
    @Unique(["name"])
    company_name: string

    @IsString()
    @Length(16, 16)
    @Unique(["cnpj"])
    cnpj: string

    readonly credentials: CreateUserDTO

    readonly address: CreateAddressDTO
}
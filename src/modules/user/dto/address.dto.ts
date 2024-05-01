import { IsInt, IsString, Length } from "class-validator";

export class AddressDto {
    @IsString()
    @Length(5, 50)
    readonly city: string

    @IsString()
    @Length(8, 8)
    readonly cep: string

    @IsString()
    @Length(5, 100)
    readonly street: string

    @IsString()
    @Length(1, 10)
    readonly number: string

    @IsString()
    @Length(0, 30)
    readonly complement: string
}

export class CreateAddressDTO   {
    @IsInt()
    @Length(1, 2)
    uf: number

    @IsString()
    @Length(5, 50)
    city: string

    @IsString()
    @Length(8, 8)
    cep: string

    @IsString()
    @Length(5, 100)
    street: string

    @IsString()
    @Length(1, 10)
    number: string

    @IsString()
    @Length(0, 30)
    complement: string
}
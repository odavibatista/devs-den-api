import { IsString, Length } from "class-validator";
import { CreateAddressDTO } from "src/modules/user/dto/address.dto";
import { CreateUserDTO } from "src/modules/user/dto/user.dto";

export class CreateCandidateDTO {
    @IsString()
    @Length(5, 50)
    readonly name: string

    @IsString()
    @Length(4, 6)
    readonly gender: 'male' | 'female'

    @IsString()
    readonly birth_date: string

    readonly credentials: CreateUserDTO

    readonly address: CreateAddressDTO
}
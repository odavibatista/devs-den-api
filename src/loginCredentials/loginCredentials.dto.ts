import { IsEnum, IsString, Length } from 'class-validator'
import { Unique } from 'typeorm'

export class CreateCredentialsDTO   {
    @IsString()
    @Length(10, 50)
    @Unique(["email"])
    readonly email: string

    @IsString()
    @Length(10, 250)
    readonly password: string

    @IsEnum(["company", "candidate"])
    readonly role: string
}

export class UpdatePasswordDTO   {
    @IsString()
    @Length(10, 250)
    readonly password: string
}
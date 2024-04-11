import { IsEmail, IsEnum, IsString, Length } from 'class-validator'
import { Unique } from 'typeorm'

export class LoginDTO   {
    @IsEmail()
    @Length(15, 50)
    readonly email: string

    @IsString()
    @Length(15, 250)
    readonly password: string

}

export class CreateCredentialsDTO   {
    @IsString()
    @Length(10, 50)
    @Unique(["email"])
    readonly email: string

    @IsString()
    @Length(15, 250)
    readonly password: string

    @IsEnum(["company", "candidate"])
    readonly role: string
}

export class UpdatePasswordDTO   {
    @IsString()
    @Length(10, 250)
    readonly password: string
}
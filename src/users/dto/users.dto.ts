import { IsEmail, IsEnum, IsString, Length } from 'class-validator'
import { Unique } from 'typeorm'

export class UserDTO   {
    @IsEmail()
    @Length(15, 50)
    readonly email: string

    @IsString()
    @Length(15, 250)
    readonly password: string
}

export class CreateUserDTO   {
    @IsString()
    @Length(10, 50)
    @Unique(["email"])
    readonly email: string

    @IsString()
    @Length(15, 250)
    readonly password: string

    @IsString()
    @Length(7, 9)
    readonly role: "company" | "candidate"
}

export class UpdatePasswordDTO   {
    @IsString()
    @Length(10, 250)
    readonly password: string
}
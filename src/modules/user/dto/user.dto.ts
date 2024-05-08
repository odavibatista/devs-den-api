import { IsEmail, IsString, Length } from 'class-validator'
import { Unique } from 'typeorm'

export class UserDTO   {
    @IsEmail()
    @Length(15, 50)
    readonly email: string

    @IsString()
    @Length(15, 255)
    readonly password: string
}

export class CreateUserDTO   {
    @IsString()
    @Length(10, 50)
    @Unique(["email"])
    email: string

    @IsString()
    @Length(15, 255)
    password: string

    @IsString()
    @Length(7, 9)
    role: "company" | "candidate"
}

export class UpdatePasswordDTO   {
    @IsString()
    @Length(10, 250)
    readonly password: string
}

export class LoginDTO   {
    @IsString()
    @Length(10, 50)
    readonly email: string

    @IsString()
    readonly inserted_password: string
}
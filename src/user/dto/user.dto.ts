import { IsEmail, IsString, Length } from 'class-validator'
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
    email: string

    @IsString()
    @Length(15, 250)
    password: string

    @IsString()
    @Length(7, 9)
    role: "company" | "candidate"
 
    getPassword()   {
        return this.password
    }

    setPassword(new_password: string)   {
        this.password = new_password
    }
}

export class UpdatePasswordDTO   {
    @IsString()
    @Length(10, 250)
    readonly password: string
}
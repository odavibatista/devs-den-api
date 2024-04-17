import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Role {
    COMPANY = 'company',
    CANDIDATE = 'candidate'
}

@Entity()
export class LoginCredentials  {
    @PrimaryGeneratedColumn()
    id_login: number

    @Column({
        unique: true,
        length: 50
    })
    email: string

    @Column({
        length: 250
    })
    password: string

    @Column({
        name: "role",
        type: "enum",
        enum: [Role.CANDIDATE, Role.COMPANY],
        enumName: "role"
    })
    role: string

    @Column({})
    created_at: Date

    @Column({})
    updated_at: Date
}
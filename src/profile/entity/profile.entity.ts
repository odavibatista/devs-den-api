import { Addresses } from "src/address/address.entity";
import { Users } from "src/users/entity/user.entity";
import { Skills } from "src/skill/entity/skill.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

@Entity()
export class Profiles  {
    @PrimaryColumn()
    id_profile: number
    
    @OneToOne(()    => Users, (user) => user.id_login, {
        nullable: false
    })

    @Column({
        length: 50,
        nullable: false
    })
    nome: string

    @Column({
        name: "gender",
        type: "enum",
        enum: [Gender.MALE, Gender.FEMALE],
        enumName: "gender",
        nullable: false
    })
    gender: string

    @Column({
        nullable: false
    })
    birth_date: Date

    @OneToOne(()    => Addresses, (address) => address.id_address, {
        nullable: false
    })
    address_id: number

    @ManyToMany(()  =>  Skills, skill => skill.id_skill)

    @CreateDateColumn({
        nullable: false
    })
    created_at: Date

    @UpdateDateColumn({
        nullable: false
    })
    updated_at: Date
}
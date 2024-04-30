import { AddressEntity } from "src/modules/user/entity/address.entity";
import { Skills } from "src/modules/skill/entity/skill.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/modules/user/entity/user.entity";

enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

@Entity()
export class Candidate  {
    @PrimaryColumn()
    id_profile: number
    
    @OneToOne(()    => User, (user) => user.id_login, {
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

    @OneToOne(()    => AddressEntity, (address) => address.id_address, {
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
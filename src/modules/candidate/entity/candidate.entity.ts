import { Address } from "src/modules/address/entity/address.entity";
import { Skill } from "src/modules/skill/entity/skill.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/modules/user/entity/user.entity";

enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

@Entity()
export class Candidate  {
    @PrimaryColumn()    
    @OneToOne(()    => User, (user) => user.id_user, {
        nullable: false
    })
    id_user: number

    @Column({
        length: 50,
        nullable: false
    })
    name: string

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

    @OneToOne(()    => Address, (address) => address.id_address, {
        nullable: false
    })
    address_id: number

    @ManyToMany(()  =>  Skill, skill => skill.id_skill)

    @CreateDateColumn({
        nullable: false
    })
    created_at: Date

    @UpdateDateColumn({
        nullable: false
    })
    updated_at: Date
}
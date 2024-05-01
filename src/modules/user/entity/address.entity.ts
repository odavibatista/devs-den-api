import { Uf } from "src/modules/uf/entity/uf.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address  {
    @PrimaryGeneratedColumn({})
    id_address: number

    @ManyToOne(()   =>  Uf, (uf) =>  uf.id_uf,   {
        nullable: false
    })
    uf: Uf

    @Column({
        length: 50,
        nullable: false
    })
    city: string

    @Column({
        length: 8,
        nullable: false
    })
    cep: string

    @Column({
        length: 100,
        nullable: false
    })
    street: string

    @Column({
        length: 10,
        nullable: false
    })
    number: string

    @Column({
        length: 30,
        nullable: false
    })
    complement: string

    @Column({
        nullable: false
    })
    created_at: Date

    @Column({
        nullable: false
    })
    updated_at: Date
}
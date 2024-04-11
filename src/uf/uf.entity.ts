import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ufs  {
    @PrimaryGeneratedColumn()
    id_uf: number

    @Column({
        length: 50
    })
    name: string

    @Column({
        length: 2
    })
    acronym: string

    @Column({})
    created_at: Date

    @Column({})
    updated_at: Date
}
import { Ufs } from "src/uf/entity/uf.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Companies  {
    @PrimaryGeneratedColumn({})
    id_company: number

    @ManyToOne(()   =>  Ufs, (uf) =>  uf.id_uf,   {
        nullable: false
    })
    uf: Ufs

    @Column({
        length: 50,
        nullable: false
    })
    name: string

    @Column({
        length: 16,
        nullable: false,
        unique: true
    })
    cnpj: string

    @CreateDateColumn({
        nullable: false
    })
    created_at: Date

    @UpdateDateColumn({
        nullable: false
    })
    updated_at: Date
}
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Company  {
    @PrimaryGeneratedColumn({})
    id_company: number

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
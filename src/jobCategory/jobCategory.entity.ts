import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class JobCategories  {
    @PrimaryGeneratedColumn()
    id_category: number

    @Column({
        length: 50
    })
    name: string

    @Column({})
    created_at: Date

    @Column({})
    updated_at: Date
}
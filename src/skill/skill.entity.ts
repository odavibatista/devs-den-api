import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Skills {
    @PrimaryGeneratedColumn()
    id_skill: number

    @Column({
        length: 35
    })
    name: string
}
import { Companies } from "src/company/company.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum Modality {
    PRESENTIAL = 'presential',
    HYBRID = 'hybrid',
    REMOTE = 'remote'
}

@Entity()
export class Jobs  {
    @PrimaryGeneratedColumn()
    id_job: number

    @Column({
        length: 60,
        nullable: false
    })
    title: string

    @Column({
        nullable: false
    })
    description: string

    @ManyToOne(()   =>  Companies, (company) =>  company.id_company,   {
        nullable: false
    })
    company_id: number

    @Column({
        nullable: false
    })
    wage: number

    @Column({
        name: "modality",
        type: "enum",
        enum: [Modality.HYBRID, Modality.PRESENTIAL, Modality.REMOTE],
        enumName: "modality"
    })
    modality: string
    
    @CreateDateColumn({
        nullable: false
    })
    created_at: Date

    @UpdateDateColumn({
        nullable: false
    })
    updated_at: Date
}
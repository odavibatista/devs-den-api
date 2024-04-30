import { Company } from "src/modules/company/entity/company.entity";
import { Candidate } from "src/modules/candidate/entity/candidate.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum Modality {
    PRESENTIAL = 'presential',
    HYBRID = 'hybrid',
    REMOTE = 'remote'
}

@Entity()
export class Job  {
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

    @ManyToOne(()   =>  Company, (company) =>  company.id_company,   {
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
    
    @ManyToMany(()  => Candidate, user => user.id_profile)
    @JoinTable({
        name: 'job_subscribes',
        joinColumn: {
            name: 'job_id',
            referencedColumnName: 'id_job'
        },
        inverseJoinColumn:  {
            name: 'user_id',
            referencedColumnName: 'id_profile'
        }
    })

    @CreateDateColumn({
        nullable: false
    })
    created_at: Date

    @UpdateDateColumn({
        nullable: false
    })
    updated_at: Date
}
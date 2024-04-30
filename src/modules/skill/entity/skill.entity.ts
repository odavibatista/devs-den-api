import { Job } from 'src/modules/job/entity/job.entity';
import { Candidate } from 'src/modules/candidate/entity/candidate.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id_skill: number

    @Column({
        length: 35
    })
    name: string

    @ManyToMany(()  =>  Candidate, user => user.id_profile)
    @JoinTable({
        name: 'user_skills',
        joinColumn: {
            name: 'skill_id',
            referencedColumnName: 'id_skill'
        },
        inverseJoinColumn:  {
            name: 'user_id',
            referencedColumnName: 'id_profile'
        }
    })

    @ManyToMany(()  =>  Job, job => job.id_job)
    @JoinTable({
        name: 'job_skills',
        joinColumn: {
            name: 'skill_id',
            referencedColumnName: 'id_skill'
        },
        inverseJoinColumn:  {
            name: 'job_id',
            referencedColumnName: 'id_job'
        }
    })
    
    @ManyToMany(()  => Candidate, user => user.id_profile)
    @JoinTable({
        name: 'user_skills',
        joinColumn: {
            name: 'skill_id',
            referencedColumnName: 'id_skill'
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
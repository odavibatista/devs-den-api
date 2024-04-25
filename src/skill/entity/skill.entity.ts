import { Jobs } from 'src/job/job.entity';
import { Profiles } from 'src/profile/entity/profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Skills {
    @PrimaryGeneratedColumn()
    id_skill: number

    @Column({
        length: 35
    })
    name: string

    @ManyToMany(()  =>  Profiles, user => user.id_profile)
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

    @ManyToMany(()  =>  Jobs, job => job.id_job)
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
    
    @ManyToMany(()  => Profiles, user => user.id_profile)
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
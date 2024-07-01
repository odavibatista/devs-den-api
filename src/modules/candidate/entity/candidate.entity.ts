import { Address } from '../../../modules/address/entity/address.entity';
import { Skill } from '../../../modules/skill/entity/skill.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../modules/user/entity/user.entity';
import { Job } from '../../../modules/job/entity/job.entity';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
class Candidates {
  @PrimaryColumn()
  @OneToOne(() => User, (user) => user.id_user, {
    nullable: false,
  })
  id_user: number;

  @Column({
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: [Gender.MALE, Gender.FEMALE],
    enumName: 'gender',
    nullable: false,
  })
  gender: string;

  @Column({
    nullable: false,
  })
  birth_date: string;

  @Column({
    nullable: true,
  })
  deleted_at: string;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @ManyToMany(() => Skill, (skill) => skill.id_skill)
  @JoinTable({
    name: 'user_skills',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id_user',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id_skill',
    },
  })
  skills: Skill[];

  @ManyToMany(() => Job, (job) => job.id_job, { cascade: true })
  @JoinTable({
    name: 'job_applications',
    joinColumn: {
      name: 'candidate_id',
      referencedColumnName: 'id_user',
    },
    inverseJoinColumn: {
      name: 'job_id',
      referencedColumnName: 'id_job',
    },
  })
  applications: Job[];

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { Candidates as Candidate };

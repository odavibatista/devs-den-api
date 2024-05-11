import { Job } from 'src/modules/job/entity/job.entity';
import { Candidate } from 'src/modules/candidate/entity/candidate.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
class Skills {
  @PrimaryGeneratedColumn()
  id_skill: number;

  @Column({
    length: 35,
  })
  name: string;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { Skills as Skill }
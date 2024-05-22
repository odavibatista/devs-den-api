import { Company } from 'src/modules/company/entity/company.entity';
import { Candidate } from 'src/modules/candidate/entity/candidate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobCategory } from 'src/modules/job-category/entity/job-category.entity';
import { Skill } from 'src/modules/skill/entity/skill.entity';

enum Modality {
  PRESENTIAL = 'presential',
  HYBRID = 'hybrid',
  REMOTE = 'remote',
}

enum Contract {
  CLT = 'clt',
  PJ = 'pj',
  INTERN = 'intern',
}

@Entity()
class Jobs {
  @ManyToMany(() => Candidate, (user) => user.id_user)
  @PrimaryGeneratedColumn()
  id_job: number;

  @Column({
    length: 60,
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  description: string;

  @ManyToOne(() => Company, (company) => company.id_user, {
    nullable: false,
  })
  @JoinColumn({ name: 'company_id' })
  @Column({
    nullable: false,
  })
  company_id: number;

  @ManyToOne(() => JobCategory, (jobCategory) => jobCategory.id_category, {
    nullable: false,
  })
  @JoinColumn({ name: 'job_category_id' })
  @Column({
    nullable: false,
  })
  job_category_id: number;

  @Column({
    nullable: false,
  })
  wage: number;

  @Column({
    name: 'modality',
    type: 'enum',
    enum: [Modality.HYBRID, Modality.PRESENTIAL, Modality.REMOTE],
    enumName: 'modality',
  })
  modality: string;

  @Column({
    name: 'contract',
    type: 'enum',
    enum: [Contract.CLT, Contract.INTERN, Contract.PJ],
    enumName: 'contract',
  })
  contract: string;

  @Column({
    nullable: true,
  })
  deleted_at: string;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { Jobs as Job };

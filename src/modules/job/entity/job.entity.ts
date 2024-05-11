import { Company } from 'src/modules/company/entity/company.entity';
import { Candidate } from 'src/modules/candidate/entity/candidate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobCategory } from 'src/modules/job-category/entity/job-category.entity';

enum Modality {
  PRESENTIAL = 'presential',
  HYBRID = 'hybrid',
  REMOTE = 'remote',
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

  @OneToMany(() => Company, (company) => company.id_user, {
    nullable: false,
  })
  @Column()
  company_id: number;

  @OneToMany(() => JobCategory, (jobCategory) => jobCategory.id_category, {
    nullable: false,
  })
  @Column()
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

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { Jobs as Job }
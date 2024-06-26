import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Ufs {
  @PrimaryGeneratedColumn()
  id_uf: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 2,
  })
  acronym: string;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { Ufs as Uf };

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class JobCategories {
  @PrimaryGeneratedColumn()
  id_category: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 300
  })
  image_url: string
  
  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { JobCategories as JobCategory }
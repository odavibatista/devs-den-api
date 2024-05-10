import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  COMPANY = 'company',
  CANDIDATE = 'candidate',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    length: 500,
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: [Role.CANDIDATE, Role.COMPANY],
    enumName: 'role',
  })
  role: string;

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

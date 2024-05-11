import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Companies {
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
    length: 16,
    nullable: false,
    unique: true,
  })
  cnpj: string;

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

export { Companies as Company };

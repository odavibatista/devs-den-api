import { Uf } from '../../../modules/uf/entity/uf.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
class Addresses {
  @OneToOne(() => User, (user) => user.id_user, {
    nullable: false,
  })
  @PrimaryColumn()
  @JoinColumn({ name: 'id_address' })
  id_address: number;

  @ManyToOne(() => Uf, (uf) => uf.id_uf, {
    nullable: false,
  })
  @JoinColumn({ name: 'uf_id' })
  @Column({
    nullable: false,
  })
  uf_id: number;

  @Column({
    length: 50,
    nullable: false,
  })
  city: string;

  @Column({
    length: 8,
    nullable: false,
  })
  cep: string;

  @Column({
    length: 100,
    nullable: false,
  })
  street: string;

  @Column({
    length: 10,
    nullable: false,
  })
  number: string;

  @Column({
    length: 30,
    nullable: true,
  })
  complement: string;

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

export { Addresses as Address };

import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { eager: true })
  buyer: UserEntity;

  @ManyToOne(() => ProductEntity, { eager: true })
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column()
  totalSpent: number;

  @CreateDateColumn()
  createdAt: Date;
}

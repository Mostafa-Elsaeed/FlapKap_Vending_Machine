import { UserEntity } from '../user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  cost: number; // must be multiple of 5

  @Column()
  amountAvailable: number;

  @ManyToOne(() => UserEntity, (user) => user.products, { eager: true })
  seller: UserEntity;
}

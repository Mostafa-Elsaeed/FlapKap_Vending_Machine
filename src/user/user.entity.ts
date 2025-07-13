import { BaseEntity } from '../database/base-entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoleEnum } from './role.enum';
import { ProductEntity } from '../product/product.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  hashPassword: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.SELLER,
  })
  role: RoleEnum;

  @OneToMany(() => ProductEntity, (product) => product.seller)
  products: ProductEntity[];

  @Column({ default: 0 })
  deposit: number;
}

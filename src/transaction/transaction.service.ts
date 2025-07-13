import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyDto } from './dto/buy.dto';
import { UserEntity } from 'src/user/user.entity';
import { ProductEntity } from 'src/product/product.entity';
import { TransactionEntity } from './transaction.entity';

const VALID_COINS = [100, 50, 20, 10, 5];
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
  ) {}

  async buy(dto: BuyDto, buyerId: string) {
    const user = await this.userRepo.findOne({ where: { id: buyerId } });
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
      relations: ['seller'],
    });

    if (!user) throw new NotFoundException('User not found');
    if (!product) throw new NotFoundException('Product not found');

    if (product.amountAvailable < dto.quantity) {
      throw new BadRequestException('Not enough stock');
    }

    const totalCost = product.cost * dto.quantity;

    if (user.deposit < totalCost) {
      throw new BadRequestException('Insufficient deposit');
    }

    // Update product stock and user deposit
    product.amountAvailable -= dto.quantity;
    user.deposit -= totalCost;

    await this.productRepo.save(product);
    await this.userRepo.save(user);

    // Save transaction record
    const transaction = this.transactionRepo.create({
      buyer: user,
      product,
      quantity: dto.quantity,
      totalSpent: totalCost,
    });
    await this.transactionRepo.save(transaction);

    return {
      totalSpent: totalCost,
      product: product.productName,
      quantity: dto.quantity,
      change: this.calculateChange(user.deposit),
    };
  }

  private calculateChange(amount: number) {
    const result: number[] = [];
    for (const coin of VALID_COINS) {
      while (amount >= coin) {
        result.push(coin);
        amount -= coin;
      }
    }
    return result;
  }

  async getHistory(buyerId: string) {
    return this.transactionRepo.find({
      where: { buyer: { id: buyerId } },
      order: { createdAt: 'DESC' },
    });
  }
}

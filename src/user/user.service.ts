import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.create.dto';
import * as bcrypt from 'bcrypt';
const VALID_COINS = [5, 10, 20, 50, 100];

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findUser(email: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async createUser(userInfo: UserDto) {
    const existingUser = await this.findUser(userInfo.email);
    if (existingUser) {
      throw new HttpException(
        'User already exists with this email',
        HttpStatus.CONFLICT,
      );
    }
    const user = this.usersRepository.create({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      hashPassword: await this.hashPassword(userInfo.password),
    });
    return this.usersRepository.save(user);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async deposit(userId: string, coin: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!VALID_COINS.includes(coin)) {
      throw new Error('Invalid coin'); // also validated via DTO
    }

    user.deposit += coin;
    await this.usersRepository.save(user);
    return { deposit: user.deposit };
  }

  async resetDeposit(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const refund = this.calculateChange(user.deposit);
    user.deposit = 0;
    await this.usersRepository.save(user);

    return { refunded: refund };
  }

  private calculateChange(amount: number): number[] {
    const coins = [100, 50, 20, 10, 5];
    const result: number[] = [];

    for (const coin of coins) {
      while (amount >= coin) {
        result.push(coin);
        amount -= coin;
      }
    }

    return result;
  }
}

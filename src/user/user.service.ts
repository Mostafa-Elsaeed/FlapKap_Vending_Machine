import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.create.dto';
import * as bcrypt from 'bcrypt';

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
}

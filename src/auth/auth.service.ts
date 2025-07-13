import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UserService } from '../user/user.service';
import { IJwtPayload } from './interfaces/jwt.interface';
import { CreateSellerDto } from './dto/create-seller.dto';
import { RoleEnum } from 'src/user/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await this.userService.comparePasswords(
      password,
      user.hashPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUp: SignUpDto) {
    // console.log(signUp);
    await this.throwExceptionIfUserExist(signUp.email);
    return await this.userService.createUser({
      firstName: signUp.firstName,
      lastName: signUp.lastName,
      email: signUp.email,
      password: signUp.password,
      role: RoleEnum.BUYER,
    });
  }

  async throwExceptionIfUserExist(email: string) {
    const existingUser = await this.userService.findUser(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
  }

  async createSeller(sellerDto: CreateSellerDto) {
    await this.throwExceptionIfUserExist(sellerDto.email);
    return await this.userService.createUser({
      firstName: sellerDto.firstName,
      lastName: sellerDto.lastName,
      email: sellerDto.email,
      password: sellerDto.password,
      role: RoleEnum.SELLER,
    });
  }
}

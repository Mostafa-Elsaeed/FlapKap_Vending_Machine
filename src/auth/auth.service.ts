import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UserService } from 'src/user/user.service';

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
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUp: SignUpDto) {
    // console.log(signUp);
    return await this.userService.createUser({
      firstName: signUp.firstName,
      lastName: signUp.lastName,
      email: signUp.email,
      password: signUp.password,
    });
  }
}

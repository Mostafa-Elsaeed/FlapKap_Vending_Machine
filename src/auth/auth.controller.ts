import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { RoleEnum } from 'src/user/role.enum';
import { Roles } from './decorators/role.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/role.guard';
import { CreateSellerDto } from './dto/create-seller.dto';
// import { join } from "path";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUp: SignUpDto) {
    // console.log(signUp);
    return await this.authService.signUp(signUp);
  }

  @Post('create-seller')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SELLER)
  async createSeller(@Body() sellerDto: CreateSellerDto) {
    return await this.authService.createSeller(sellerDto);
  }
}

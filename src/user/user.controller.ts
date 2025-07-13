import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { RoleEnum } from './role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { User } from '../auth/decorators/user.decorator';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { UserService } from './user.service';
import { DepositDto } from './dto/deposit.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.BUYER)
  @Post('deposit')
  deposit(@Body() dto: DepositDto, @User() user: IJwtPayload) {
    return this.usersService.deposit(user.sub, dto.coin);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.BUYER)
  @Post('reset')
  reset(@User() user: IJwtPayload) {
    return this.usersService.resetDeposit(user.sub);
  }
}

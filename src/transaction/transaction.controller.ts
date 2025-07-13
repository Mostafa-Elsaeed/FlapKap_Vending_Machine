import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { BuyDto } from './dto/buy.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleEnum } from 'src/user/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { TransactionsService } from './transaction.service';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.BUYER)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('buy')
  async buy(@Body() dto: BuyDto, @User() user: IJwtPayload) {
    const userId = user.sub;
    return this.transactionsService.buy(dto, userId);
  }
}

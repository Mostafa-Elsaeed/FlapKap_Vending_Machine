import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { BuyDto } from './dto/buy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { RoleEnum } from '../user/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { TransactionsService } from './transaction.service';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { User } from '../auth/decorators/user.decorator';

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

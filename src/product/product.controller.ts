import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../user/role.enum';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SELLER)
  @Post()
  create(@Body() dto: CreateProductDto, @User() user: IJwtPayload) {
    return this.productsService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SELLER)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    // @User() user: IJwtPayload,
    // @Request() req,
  ) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException();
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SELLER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException();
    return this.productsService.remove(+id);
  }
}

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
  ForbiddenException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleEnum } from 'src/user/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
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
    @User() user: IJwtPayload,
    // @Request() req,
  ) {
    const product = await this.productsService.findOne(+id);
    if (!product) throw new NotFoundException();
    if (product.seller.id !== user.sub)
      throw new ForbiddenException('You can only update your own product');
    return this.productsService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SELLER)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IJwtPayload) {
    const product = await this.productsService.findOne(+id);
    if (!product) throw new NotFoundException();
    if (product.seller.id !== user.sub)
      throw new ForbiddenException('You can only delete your own product');
    return this.productsService.remove(+id);
  }
}

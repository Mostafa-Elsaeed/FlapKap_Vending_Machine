import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: string) {
    return this.productRepo.findOne({ where: { id } });
  }

  create(dto: CreateProductDto, user: IJwtPayload) {
    const product = this.productRepo.create({
      ...dto,
      seller: { id: user.sub },
    });
    return this.productRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.productRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.productRepo.delete(id);
  }
}

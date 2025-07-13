import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
import { RoleEnum } from '../user/role.enum';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [{ id: 1, name: 'Product 1' }];
      mockProductService.findAll.mockResolvedValue(expectedProducts);

      const result = await controller.findAll();

      expect(result).toEqual(expectedProducts);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto: CreateProductDto = {
        productName: 'New Product',
        cost: 100,
        amountAvailable: 1,
      };
      const user: IJwtPayload = {
        sub: '1',
        email: 'seller@example.com',
        role: 'seller',
      };
      const expectedResult = { id: 1, ...createDto, seller: { id: user.sub } };

      mockProductService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, user);

      expect(mockProductService.create).toHaveBeenCalledWith(createDto, user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if product does not exist', async () => {
      const id = '1';
      const updateDto: UpdateProductDto = { productName: 'Updated Product' };
      //   const user: IJwtPayload = {
      //     sub: '1',
      //     email: 'seller@example.com',
      //     role: 'seller',
      //   };

      mockProductService.findOne.mockResolvedValue(null);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProductService.findOne).toHaveBeenCalledWith(id);
    });

    describe('remove', () => {
      it('should throw NotFoundException if product does not exist', async () => {
        const id = '1';
        // const user: IJwtPayload = {
        //   sub: '1',
        //   email: 'seller@example.com',
        //   role: 'seller',
        // };

        mockProductService.findOne.mockResolvedValue(null);

        await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
        expect(mockProductService.findOne).toHaveBeenCalledWith(id);
      });
    });
  });
});

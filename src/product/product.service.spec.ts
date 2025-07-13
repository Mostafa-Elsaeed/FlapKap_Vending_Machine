import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { RoleEnum } from '../user/role.enum';
import { ObjectLiteral } from 'typeorm';

type MockRepository<T extends ObjectLiteral = any> = {
  find: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ProductService', () => {
  let service: ProductService;
  let repository: MockRepository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<MockRepository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [{ id: 1, name: 'Product 1' }];
      repository.find.mockResolvedValue(expectedProducts);

      const result = await service.findAll();
      expect(result).toEqual(expectedProducts);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = '1';
      const expectedProduct = { id: productId, name: 'Product 1' };
      repository.findOne.mockResolvedValue(expectedProduct);

      const result = await service.findOne(productId);
      expect(result).toEqual(expectedProduct);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto: CreateProductDto = {
        productName: 'New Product',
        cost: 100,
        amountAvailable: 1,
      };
      const user: IJwtPayload = {
        sub: '1',
        email: 'user@example.com',
        role: RoleEnum.SELLER,
      };

      const createdProduct = { id: 1, ...createDto, seller: { id: user.sub } };

      repository.create.mockReturnValue(createdProduct);
      repository.save.mockResolvedValue(createdProduct);

      const result = await service.create(createDto, user);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        seller: { id: user.sub },
      });
      expect(repository.save).toHaveBeenCalledWith(createdProduct);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = '1';
      const updateDto: UpdateProductDto = { productName: 'Updated Product' };
      const updatedProduct = { id: productId, name: 'Updated Product' };

      repository.update.mockResolvedValue({ affected: 1 });
      repository.findOne.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateDto);

      expect(repository.update).toHaveBeenCalledWith(productId, updateDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = 1;
      const deleteResult = { affected: 1 };

      repository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(productId);

      expect(repository.delete).toHaveBeenCalledWith(productId);
      expect(result).toEqual(deleteResult);
    });
  });
});

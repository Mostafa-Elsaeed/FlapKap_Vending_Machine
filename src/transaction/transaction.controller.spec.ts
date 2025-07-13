import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './transaction.service';
import { BuyDto } from './dto/buy.dto';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { RoleEnum } from '../user/role.enum';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    buy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    })
      // Mock the guards for testing
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('buy', () => {
    it('should call transactionsService.buy with correct parameters', async () => {
      // Mock input data
      const buyDto: BuyDto = {
        // Fill with appropriate test data based on your BuyDto structure
        productId: 'product-123',
        quantity: 2,
      };

      const user: IJwtPayload = {
        sub: 'user-123',
        email: 'user@example.com',
        role: RoleEnum.BUYER,
      };

      // Mock service response
      const expectedResult = {
        success: true,
        transactionId: 'transaction-123',
      };
      mockTransactionsService.buy.mockResolvedValue(expectedResult);

      // Call the controller method
      const result = await controller.buy(buyDto, user);

      // Assertions
      expect(mockTransactionsService.buy).toHaveBeenCalledWith(
        buyDto,
        'user-123',
      );
      expect(result).toEqual(expectedResult);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DepositDto } from './dto/deposit.dto';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { RoleEnum } from './role.enum';

describe('UserController', () => {
  let controller: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;

  const mockUserService = {
    deposit: jest.fn(),
    resetDeposit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('should call userService.deposit with the user id and coin amount', async () => {
      const depositDto: DepositDto = { coin: 100 };
      const user: IJwtPayload = {
        sub: '1',
        email: 'buyer@example.com',
        role: RoleEnum.BUYER,
      };
      const expectedResult = { id: 1, deposit: 100 };

      mockUserService.deposit.mockResolvedValue(expectedResult);

      const result = await controller.deposit(depositDto, user);

      expect(mockUserService.deposit).toHaveBeenCalledWith(
        user.sub,
        depositDto.coin,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('reset', () => {
    it('should call userService.resetDeposit with the user id', async () => {
      const user: IJwtPayload = {
        sub: '1',
        email: 'buyer@example.com',
        role: RoleEnum.BUYER,
      };
      const expectedResult = { id: '1', deposit: 0 };

      mockUserService.resetDeposit.mockResolvedValue(expectedResult);

      const result = await controller.reset(user);

      // Reference the mock directly instead of through userService
      expect(mockUserService.resetDeposit).toHaveBeenCalledWith(user.sub);
      expect(result).toEqual(expectedResult);
    });
  });
});

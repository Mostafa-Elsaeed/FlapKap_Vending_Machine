import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: {
    signIn: jest.Mock;
    signUp: jest.Mock;
  };

  beforeEach(async () => {
    mockAuthService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authController = module.get<AuthController>(AuthController);
  });
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should call authService.signIn with signin dto', async () => {
      const signInDto: SignInDto = {
        email: 'testuser',
        password: 'password123',
      };
      const expectedResult = { access_token: 'test-token' };

      mockAuthService.signIn.mockReturnValue(expectedResult);

      const result = await authController.signIn(signInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signUp', () => {
    it('should call authService.signUp with signup dto', async () => {
      const email = 'testemail@gmail.com';
      const signUpDto: SignUpDto = {
        firstName: 'Mostafa',
        lastName: 'Elsaeed',
        email: email,
        password: 'changeme',
      };
      const expectedResult = { email: email };

      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await authController.signUp(signUpDto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });
  });
});

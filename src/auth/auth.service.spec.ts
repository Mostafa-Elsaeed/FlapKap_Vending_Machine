import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserService = {
    findUser: jest.fn(),
    comparePasswords: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authService = module.get<AuthService>(AuthService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockUserService.findUser.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
      expect(mockUserService.findUser).toHaveBeenCalledWith(signInDto.email);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        hashPassword: 'hashedPassword',
        role: 'user',
      };

      mockUserService.findUser.mockResolvedValue(mockUser);
      mockUserService.comparePasswords.mockResolvedValue(false);

      // Act & Assert
      await expect(authService.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findUser).toHaveBeenCalledWith(signInDto.email);
      expect(mockUserService.comparePasswords).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.hashPassword,
      );
    });

    it('should return access token when credentials are valid', async () => {
      // Arrange
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        hashPassword: 'hashedPassword',
        role: 'user',
      };
      const mockToken = 'jwt.token.here';

      mockUserService.findUser.mockResolvedValue(mockUser);
      mockUserService.comparePasswords.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      // Act
      const result = await authService.signIn(signInDto);

      // Assert
      expect(mockUserService.findUser).toHaveBeenCalledWith(signInDto.email);
      expect(mockUserService.comparePasswords).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.hashPassword,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({ access_token: mockToken });
    });
  });

  describe('signUp', () => {
    it('should create a new user and return the result', async () => {
      // Arrange
      const signUpDto: SignUpDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockCreatedUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        // Other user properties
      };

      mockUserService.createUser.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await authService.signUp(signUpDto);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        email: signUpDto.email,
        password: signUpDto.password,
      });
      expect(result).toEqual(mockCreatedUser);
    });
  });
});

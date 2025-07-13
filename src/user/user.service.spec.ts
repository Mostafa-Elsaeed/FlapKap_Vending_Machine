import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<UserEntity>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUser', () => {
    it('should find a user by email', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findUser('test@example.com');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findUser('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('createUser', () => {
    it('should throw an exception if user already exists', async () => {
      const userDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'Password123',
      };

      const existingUser = { id: '1', email: 'existing@example.com' };
      const findUserSpy = jest
        .spyOn(userService, 'findUser')
        .mockResolvedValue(existingUser as UserEntity);

      await expect(userService.createUser(userDto)).rejects.toThrow(
        new HttpException(
          'User already exists with this email',
          HttpStatus.CONFLICT,
        ),
      );
      expect(findUserSpy).toHaveBeenCalledWith(userDto.email);
    });

    it('should create a new user', async () => {
      const userDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      };

      const hashedPassword = 'hashedPassword123';
      const newUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        hashPassword: hashedPassword,
      };

      const findUserSpy = jest
        .spyOn(userService, 'findUser')
        .mockResolvedValue(null);
      const hashPasswordSpy = jest
        .spyOn(userService, 'hashPassword')
        .mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await userService.createUser(userDto);

      expect(result).toEqual(newUser);
      expect(findUserSpy).toHaveBeenCalledWith(userDto.email);
      expect(hashPasswordSpy).toHaveBeenCalledWith(userDto.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        email: userDto.email,
        hashPassword: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('deposit', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      const userId = '1';
      const coin = 5;

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.deposit(userId, coin)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw Error if coin is invalid', async () => {
      const userId = '1';
      const invalidCoin = 7; // Not in VALID_COINS array
      const user = { id: userId, deposit: 10 };

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(userService.deposit(userId, invalidCoin)).rejects.toThrow(
        new Error('Invalid coin'),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should increase user deposit with valid coin', async () => {
      const userId = '1';
      const coin = 10;
      const user = { id: userId, deposit: 5 };
      const updatedUser = { id: userId, deposit: 15 };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await userService.deposit(userId, coin);

      expect(result).toEqual({ deposit: 15 });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...user,
        deposit: 15,
      });
    });
  });

  describe('resetDeposit', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      const userId = '1';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.resetDeposit(userId)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should reset user deposit and return change', async () => {
      const userId = '1';
      const user = { id: userId, deposit: 175 };
      const updatedUser = { id: userId, deposit: 0 };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await userService.resetDeposit(userId);

      expect(result).toEqual({ refunded: [100, 50, 20, 5] });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...user,
        deposit: 0,
      });
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'Password123';
      const hashedPassword = 'hashedPassword123';

      // Explicitly type the spy to handle Promise-based API
      const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.SpyInstance;
      // OR more specifically:
      // const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock<Promise<string>>;

      hashSpy.mockResolvedValue(hashedPassword);
      const result = await userService.hashPassword(password);

      expect(result).toEqual(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('comparePasswords', () => {
    it('should return true when passwords match', async () => {
      const plainPassword = 'Password123';
      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
      const result = await userService.comparePasswords(
        plainPassword,
        hashedPassword,
      );

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        hashedPassword,
      );
    });

    it('should return false when passwords do not match', async () => {
      const plainPassword = 'WrongPassword';
      const hashedPassword = 'hashedPassword123';

      const compareSpy = jest.spyOn(
        bcrypt,
        'compare',
      ) as unknown as jest.SpyInstance<Promise<boolean>>;
      compareSpy.mockResolvedValue(false);
      const result = await userService.comparePasswords(
        plainPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        hashedPassword,
      );
    });
  });
});

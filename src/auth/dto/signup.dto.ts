import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user, must be a non-empty string',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user, must be a non-empty string',
  })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'email@example.com',
    description: 'The email of the user, must be a valid email address',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  @ApiProperty({
    example: 'Password123!',
    description:
      'User password - must be at least 8 characters and include uppercase, lowercase, and special characters',
  })
  password: string;
}

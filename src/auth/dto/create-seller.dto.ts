import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSellerDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @ApiProperty({
    example: 'John',
    description: 'The first name of the seller, must be a non-empty string',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the seller, must be a non-empty string',
  })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'email@example.com',
    description: 'The email of the seller, must be a valid email address',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  @ApiProperty({
    example: 'Password123!',
    description:
      'User password - must be at least 8 characters and include uppercase, lowercase, and special characters',
  })
  password: string;
}

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { RoleEnum } from '../role.enum';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;

  role: RoleEnum;
}

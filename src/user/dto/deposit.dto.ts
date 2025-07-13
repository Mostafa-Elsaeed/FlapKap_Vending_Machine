import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsIn } from 'class-validator';

export class DepositDto {
  @IsInt()
  @IsIn([5, 10, 20, 50, 100])
  @ApiProperty({
    example: '5',
    description:
      'The amount of coins to deposit, must be one of the following: 5, 10, 20, 50, or 100',
  })
  coin: number;
}

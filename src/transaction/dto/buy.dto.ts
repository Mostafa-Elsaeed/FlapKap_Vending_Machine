import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class BuyDto {
  @IsInt()
  @ApiProperty({
    example: '123456',
    description: 'The ID of the product to buy, must be a valid integer',
  })
  productId: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    example: '1',
    description:
      'The quantity of the product to buy, must be a positive integer',
  })
  quantity: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    example: 'product name',
    description: 'The name of the product, must be a non-empty string',
  })
  productName: string;

  @IsInt()
  @Min(5)
  @IsPositive()
  @ApiProperty({
    example: '10',
    description:
      'The cost of the product, must be a positive integer greater than or equal to 5',
  })
  cost: number;

  @IsInt()
  @Min(0)
  @IsPositive()
  @ApiProperty({
    example: '2',
    description:
      'The amount of product available, must be a positive integer or zero',
  })
  amountAvailable: number;
}

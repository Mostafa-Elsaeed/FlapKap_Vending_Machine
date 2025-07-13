import { IsInt, IsString, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  productName: string;

  @IsInt()
  @Min(5)
  @IsPositive()
  cost: number;

  @IsInt()
  @Min(0)
  @IsPositive()
  amountAvailable: number;
}

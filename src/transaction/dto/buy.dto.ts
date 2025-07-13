import { IsInt, Min } from 'class-validator';

export class BuyDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

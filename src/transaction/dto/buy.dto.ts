import { IsInt, Min } from 'class-validator';

export class BuyDto {
  @IsInt()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

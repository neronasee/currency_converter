import { IsNumber, IsPositive } from 'class-validator';

export class ConvertCurrencyDto {
  @IsNumber()
  sourceCurrency: number;

  @IsNumber()
  targetCurrency: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}

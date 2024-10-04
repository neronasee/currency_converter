import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ConvertCurrencyUseCase } from '../../application/usecases/convert_currency_usecase';
import { ConvertCurrencyDto } from './dto/convecrt_currency.dto';
import { CurrencyNotFoundError } from '../../domain/errors';
import { errors } from '../../application/services/exchange_rates_provider';

@Controller('currency')
export class CurrencyController {
  constructor(
    private readonly convertCurrencyUseCase: ConvertCurrencyUseCase,
  ) {}

  @Post('convert')
  @HttpCode(200)
  async convertCurrency(@Body() currencyConversionDto: ConvertCurrencyDto) {
    try {
      const { sourceCurrency, targetCurrency, amount } = currencyConversionDto;
      const { convertedAmount, rate } =
        await this.convertCurrencyUseCase.execute(
          amount,
          sourceCurrency,
          targetCurrency,
        );

      return {
        sourceCurrency,
        targetCurrency,
        amount,
        convertedAmount,
        rate,
      };
    } catch (error) {
      if (error instanceof CurrencyNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      if (error instanceof errors.ExchangeRateProviderApiError) {
        throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
      }

      throw new HttpException(
        'An error occurred during currency conversion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

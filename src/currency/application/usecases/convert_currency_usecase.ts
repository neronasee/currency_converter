import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CurrencyConversionService } from '../../domain/services/currency_conversion.service';
import {
  ExchangeRateProvider,
  EXCHANGE_RATE_PROVIDER_TOKEN,
} from '../services/exchange_rates_provider';

@Injectable()
export class ConvertCurrencyUseCase {
  constructor(
    @Inject(EXCHANGE_RATE_PROVIDER_TOKEN)
    private readonly exchangeRateProvider: ExchangeRateProvider,
  ) {}

  async execute(
    sourceAmount: number,
    sourceCurrencyCode: number,
    targetCurrencyCode: number,
  ): Promise<{ convertedAmount: number; rate: number }> {
    const rates = await this.exchangeRateProvider.getExchangeRates();
    return CurrencyConversionService.convert(
      sourceAmount,
      sourceCurrencyCode,
      targetCurrencyCode,
      rates,
    );
  }
}

import { ExchangeRate } from '../entities/exchange_rate';
import { CurrencyNotFoundError } from '../errors';

export class CurrencyConversionService {
  static convert(
    amount: number,
    sourceCurrency: number,
    targetCurrency: number,
    exchangeRates: ExchangeRate[],
  ): { convertedAmount: number; rate: number } {
    const rate = this.getConversionRate(
      sourceCurrency,
      targetCurrency,
      exchangeRates,
    );
    return {
      convertedAmount: Number((amount * rate).toFixed(4)),
      rate,
    };
  }

  private static getConversionRate(
    sourceCurrency: number,
    targetCurrency: number,
    exchangeRates: ExchangeRate[],
  ): number {
    const directRate = this.findRate(
      sourceCurrency,
      targetCurrency,
      exchangeRates,
    );
    if (directRate) {
      return this.calculateRate(directRate, false);
    }

    const inverseRate = this.findRate(
      targetCurrency,
      sourceCurrency,
      exchangeRates,
    );

    if (inverseRate) {
      return 1 / this.calculateRate(inverseRate, true);
    }

    throw new CurrencyNotFoundError(
      `No conversion rate found for ${sourceCurrency} to ${targetCurrency} currency codes`,
    );
  }

  private static findRate(
    fromCurrency: number,
    toCurrency: number,
    rates: ExchangeRate[],
  ): ExchangeRate | undefined {
    return rates.find(
      (rate) =>
        rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency,
    );
  }

  private static calculateRate(rate: ExchangeRate, isInverse: boolean): number {
    if ('crossRate' in rate) {
      return rate.crossRate;
    }
    return isInverse ? rate.sellRate : rate.buyRate;
  }
}

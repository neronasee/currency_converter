import { HttpService } from '@nestjs/axios';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  CACHE_SERVICE_TOKEN,
  CacheService,
} from '../../../cache/cache.service';
import {
  ExchangeRateProvider,
  errors,
} from '../../application/services/exchange_rates_provider';
import { ExchangeRate } from '../../domain/entities/exchange_rate';
import { ConfigService } from '@nestjs/config';

export interface MonobankExchangeRateDto {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
}

@Injectable()
export class MonobankApiProvider implements ExchangeRateProvider {
  private readonly CACHE_KEY = 'MONO_EXCHANGE_RATES:ALL';
  private readonly logger = new Logger(MonobankApiProvider.name);
  private readonly CACHE_TTL: number;
  private readonly MONOBANK_API_URL: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_SERVICE_TOKEN) private readonly cacheService: CacheService,
    configService: ConfigService,
  ) {
    this.MONOBANK_API_URL = configService.get<string>('MONOBANK_API_URL');
    this.CACHE_TTL = configService.get<number>('EXCHANGE_RATES_CACHE_TTL');
  }

  async getExchangeRates(): Promise<ExchangeRate[]> {
    const cachedRates = await this.cacheService.get<ExchangeRate[]>(
      this.CACHE_KEY,
    );
    if (cachedRates) {
      return cachedRates;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<MonobankExchangeRateDto[]>(this.MONOBANK_API_URL),
      );
      const rates = this.mapToExchangeRates(response.data);
      await this.cacheService.set(this.CACHE_KEY, rates, this.CACHE_TTL);
      return rates;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message, error.stack);
      } else {
        this.logger.error(
          'Unknown error occurred during fetching Monobank exchange rates',
          JSON.stringify(error),
        );
      }

      throw new errors.ExchangeRateProviderApiError(
        'Failed to fetch exchange rates from Monobank API',
      );
    }
  }

  private mapToExchangeRates(
    monobankRates: MonobankExchangeRateDto[],
  ): ExchangeRate[] {
    return monobankRates.map((rate) => {
      if (rate.rateCross !== undefined) {
        return {
          fromCurrency: rate.currencyCodeA,
          toCurrency: rate.currencyCodeB,
          crossRate: rate.rateCross,
        };
      } else if (rate.rateBuy !== undefined && rate.rateSell !== undefined) {
        return {
          fromCurrency: rate.currencyCodeA,
          toCurrency: rate.currencyCodeB,
          buyRate: rate.rateBuy,
          sellRate: rate.rateSell,
        };
      } else {
        throw new Error(
          `Invalid rate data for currency pair ${rate.currencyCodeA}/${rate.currencyCodeB}`,
        );
      }
    });
  }
}

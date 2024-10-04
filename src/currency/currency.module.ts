import { EXCHANGE_RATE_PROVIDER_TOKEN } from './application/services/exchange_rates_provider';
import { Module } from '@nestjs/common';
import { CurrencyController } from './infrastructure/api/currency.controller';
import { ConvertCurrencyUseCase } from './application/usecases/convert_currency_usecase';
import { HttpModule } from '@nestjs/axios';
import { MonobankApiProvider } from './infrastructure/services/monobank_api_provider';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [HttpModule, CacheModule],
  controllers: [CurrencyController],
  providers: [
    ConvertCurrencyUseCase,
    {
      provide: EXCHANGE_RATE_PROVIDER_TOKEN,
      useClass: MonobankApiProvider,
    },
  ],
})
export class CurrencyModule {}

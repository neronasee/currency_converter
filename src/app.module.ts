import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import * as Joi from 'joi';

const configValidationSchema = Joi.object({
  PORT: Joi.number().port(),
  REDIS_CONNECTION_STRING: Joi.string().required(),
  MONOBANK_API_URL: Joi.string().required(),
  EXCHANGE_RATES_CACHE_TTL: Joi.number().default(3600),
});

@Module({
  imports: [
    CurrencyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

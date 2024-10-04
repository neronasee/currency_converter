import { ExchangeRate } from '../../domain/entities/exchange_rate';

export interface ExchangeRateProvider {
  getExchangeRates(): Promise<ExchangeRate[]>;
}

class ExchangeRateProviderApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const errors = {
  ExchangeRateProviderApiError,
};

export const EXCHANGE_RATE_PROVIDER_TOKEN = Symbol(
  'EXCHANGE_RATE_PROVIDER_TOKEN',
);

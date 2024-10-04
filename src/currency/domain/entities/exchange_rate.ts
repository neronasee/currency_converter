export type ExchangeRate = {
  fromCurrency: number;
  toCurrency: number;
} & (
  | {
      buyRate: number;
      sellRate: number;
    }
  | {
      crossRate: number;
    }
);

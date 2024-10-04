# Currency Converter

App for a currency conversion

## How to run

### Prerequisites
 - docker, docker compose
 - installed node.js (for running e2e tests)

### Installation

1. Clone the repo
```sh
git clone git@github.com:neronasee/currency_converter.git
```
2. Run app and redis with

```sh
docker-compose up
```

### Usage

1. Copy (and optionally adjust env variables) 
```sh
cp .env_example .env
```
2. Use example CURL request:

```sh
curl -X POST http://localhost:3000/currency/convert \   
   -H "Content-Type: application/json" \
   -d '{"sourceCurrency": 840, "targetCurrency": 980, "amount": 10}'
```

Example response:
```json
{
  "sourceCurrency":840,
  "targetCurrency":980,
  "amount":10,
  "convertedAmount":410.5,
  "rate":41.05
}
```

### Testing

There's only 1 simple e2e test, that requires the app to be running

1. Run e2e tests 
```sh
npm run test:e2e
```

## Fields for improvements

As it's a simple POC-type app, there are several improvements that can be applied:

- Add authorization and authentication.
- Add more robust logic for rate calculation using sell, buy, and cross rates, along with proper handling of floating-point money values.
- Add more logging.
- Add more unit tests with mocks for Redis, Monobank API, etc.
- Add more robust error handling for Monobank API (e.g., retry mechanisms, handling specific error codes).
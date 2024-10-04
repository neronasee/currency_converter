import * as request from 'supertest';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

describe('/currency/convert (POST)', () => {
  it('responds as expected to correct payload', async () => {
    const response = await request(APP_URL)
      .post('/currency/convert')
      .send({
        sourceCurrency: 840, // USD
        targetCurrency: 980, // UAH
        amount: 100,
      })
      .expect(200);

    expect(response.body).toHaveProperty('convertedAmount');
    expect(response.body).toHaveProperty('rate');
    expect(response.body.amount * response.body.rate).toBe(
      response.body.convertedAmount,
    );
  });

  it('responds with 400 to invalid payload', async () => {
    await request(APP_URL)
      .post('/currency/convert')
      .send({
        sourceCurrency: 840, // USD
        targetCurrency: 'invalid',
        amount: 100,
      })
      .expect(400)
      .expect({
        message: [
          'targetCurrency must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('responds with 404 to unsupported currency pair', async () => {
    await request(APP_URL)
      .post('/currency/convert')
      .send({
        sourceCurrency: 840, // USD
        targetCurrency: 392, // JPY
        amount: 100,
      })
      .expect(404)
      .expect({
        message: 'No conversion rate found for 840 to 392 currency codes',
        statusCode: 404,
      });
  });
});

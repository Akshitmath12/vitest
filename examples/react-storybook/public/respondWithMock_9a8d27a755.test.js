const { respondWithMock } = require('./mockServiceWorker');
jest.mock('sleep-promise');

const sleep = require('sleep-promise');

describe('respondWithMock', () => {
  beforeEach(() => {
    sleep.mockClear();
  });

  test('should call sleep with correct delay', async () => {
    const response = { delay: 500, body: 'test', status: 200 };
    await respondWithMock(response);
    expect(sleep).toHaveBeenCalledWith(response.delay);
  });

  test('should return a Response with correct body and status', async () => {
    const response = { delay: 500, body: 'test', status: 200 };
    const result = await respondWithMock(response);
    expect(result).toBeInstanceOf(Response);
    expect(result.body).toBe(response.body);
    expect(result.status).toBe(response.status);
  });

  test('should throw an error if response is not provided', async () => {
    await expect(respondWithMock()).rejects.toThrow();
  });
});

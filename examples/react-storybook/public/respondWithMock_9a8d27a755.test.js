const { respondWithMock } = require('./mockServiceWorker');

jest.useFakeTimers();

describe('respondWithMock', () => {
  let response;

  beforeEach(() => {
    response = {
      body: 'Test body',
      delay: 1000,
      status: 200,
      statusText: 'OK',
    };
  });

  test('should delay the response', async () => {
    const promise = respondWithMock(response);
    jest.runAllTimers();
    await promise;

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), response.delay);
  });

  test('should return a Response object with the correct properties', async () => {
    const result = await respondWithMock(response);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(response.status);
    expect(result.statusText).toBe(response.statusText);
    expect(await result.text()).toBe(response.body);
  });

  test('should handle errors correctly', async () => {
    response.delay = 'invalid delay';

    await expect(respondWithMock(response)).rejects.toThrow();
  });
});

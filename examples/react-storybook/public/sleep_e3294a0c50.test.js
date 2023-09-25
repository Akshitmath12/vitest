const { sleep } = require('./mockServiceWorker');

describe('sleep function', () => {
  let timeMs;
  let startTime;

  beforeEach(() => {
    timeMs = 1000;
    startTime = Date.now();
  });

  test('should resolve after specified time', async () => {
    await sleep(timeMs);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    expect(elapsedTime).toBeGreaterThanOrEqual(timeMs);
  });

  test('should not resolve before specified time', async () => {
    const promise = sleep(timeMs);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    expect(elapsedTime).toBeLessThan(timeMs);
    await promise;
  });

  test('should handle zero as input', async () => {
    timeMs = 0;
    await sleep(timeMs);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    expect(elapsedTime).toBeGreaterThanOrEqual(timeMs);
  });

  test('should throw error for negative input', async () => {
    timeMs = -1000;
    await expect(sleep(timeMs)).rejects.toThrow();
  });
});

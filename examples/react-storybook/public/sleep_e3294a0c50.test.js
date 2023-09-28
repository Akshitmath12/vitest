// Import the required dependencies
const { sleep } = require('./mockServiceWorker');

// Define the test suite
describe('sleep function tests', () => {
  // Test case 1: should resolve after specified time
  test('should resolve after specified time', async () => {
    const startTime = Date.now();
    const sleepTime = 1000; // 1 second
    await sleep(sleepTime);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    expect(elapsedTime).toBeGreaterThanOrEqual(sleepTime);
  });

  // Test case 2: should resolve immediately for zero time
  test('should resolve immediately for zero time', async () => {
    const startTime = Date.now();
    await sleep(0);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    expect(elapsedTime).toBeLessThan(50); // Should be almost immediate
  });

  // Test case 3: should reject for negative time
  test('should reject for negative time', async () => {
    await expect(sleep(-1000)).rejects.toThrow();
  });
});

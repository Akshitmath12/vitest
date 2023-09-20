// Importing necessary libraries
const { sleep } = require('./mockServiceWorker');

// Test Suite
describe('Testing sleep function', () => {
  // Test Case 1: Check if sleep function delays for the right amount of time
  test('should delay for the right amount of time', async () => {
    const start = Date.now();
    await sleep(1000);
    const end = Date.now();
    const diff = end - start;
    expect(diff).toBeGreaterThanOrEqual(1000);
    expect(diff).toBeLessThan(1100);
  });

  // Test Case 2: Check if sleep function works correctly with 0ms delay
  test('should not delay if time is 0ms', async () => {
    const start = Date.now();
    await sleep(0);
    const end = Date.now();
    const diff = end - start;
    expect(diff).toBeLessThan(100);
  });

  // Test Case 3: Check if sleep function works correctly with negative time
  test('should not delay if time is negative', async () => {
    const start = Date.now();
    await sleep(-1000);
    const end = Date.now();
    const diff = end - start;
    expect(diff).toBeLessThan(100);
  });
});

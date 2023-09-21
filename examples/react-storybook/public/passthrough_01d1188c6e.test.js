// Test generated by RoostGPT for test ReactStoryBook using AI Type Open AI and AI Model gpt-4

const fetch = require('node-fetch');
const { Headers } = require('node-fetch');

// Mocking the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Mocking the Headers function
global.Headers = jest.fn(() => ({
  entries: () => [],
}));

describe('passthrough function', () => {
  let clonedRequest;

  beforeEach(() => {
    clonedRequest = {
      headers: new Headers(),
    };
    clonedRequest.headers.set('x-msw-bypass', 'true');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete x-msw-bypass header and call fetch with clonedRequest and headers', async () => {
    const passthrough = require('./mockServiceWorker');
    await passthrough();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe(clonedRequest);
    expect(fetch.mock.calls[0][1].headers['x-msw-bypass']).toBeUndefined();
  });

  test('should not delete other headers', async () => {
    clonedRequest.headers.set('other-header', 'true');

    const passthrough = require('./mockServiceWorker');
    await passthrough();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].headers['other-header']).toBe('true');
  });
});

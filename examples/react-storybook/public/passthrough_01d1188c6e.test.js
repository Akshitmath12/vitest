const fetch = require('node-fetch');
const { Headers } = fetch;
global.fetch = fetch;
global.Headers = Headers;

const { passthrough } = require('./mockServiceWorker');

describe('passthrough function', () => {
  let clonedRequest;

  beforeEach(() => {
    clonedRequest = new Request('https://api.github.com', {
      method: 'GET',
      headers: new Headers({
        'x-msw-bypass': 'true',
        'content-type': 'application/json'
      })
    });
  });

  test('should remove x-msw-bypass header', async () => {
    const response = await passthrough(clonedRequest);
    expect(response.headers.has('x-msw-bypass')).toBe(false);
  });

  test('should keep other headers', async () => {
    const response = await passthrough(clonedRequest);
    expect(response.headers.get('content-type')).toBe('application/json');
  });

  test('should throw error for invalid request', async () => {
    clonedRequest = new Request('invalid-url');
    await expect(passthrough(clonedRequest)).rejects.toThrow('only absolute urls are supported');
  });
});

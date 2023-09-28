const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const { passthrough } = require('./mockServiceWorker');

describe('passthrough function', () => {
  let clonedRequest;

  beforeEach(() => {
    clonedRequest = new fetch.Request('https://example.com', {
      headers: new Headers({
        'x-msw-bypass': 'true',
        'Content-Type': 'application/json'
      })
    });
  });

  test('should remove x-msw-bypass header and send request', async () => {
    const response = await passthrough(clonedRequest);
    expect(response.ok).toBeTruthy();
    expect(response.headers.get('x-msw-bypass')).toBeNull();
  });

  test('should keep other headers intact', async () => {
    const response = await passthrough(clonedRequest);
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  test('should handle error when fetch fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Fetch failed'))
    );
    try {
      await passthrough(clonedRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Fetch failed');
    }
  });
});

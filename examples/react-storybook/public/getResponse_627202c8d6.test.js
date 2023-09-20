const getResponse = require('./mockServiceWorker');
const fetch = require('node-fetch');
jest.mock('node-fetch');

describe('getResponse', () => {
  let event;
  let client;
  let requestId;

  beforeEach(() => {
    event = {
      request: new Request('https://test.com', {
        method: 'GET',
        headers: new Headers({
          'x-msw-bypass': 'false'
        })
      })
    };
    client = {
      id: '1',
      postMessage: jest.fn()
    };
    requestId = '123';
    fetch.mockClear();
  });

  test('should bypass mocking when client is not active', async () => {
    client = null;
    await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should bypass mocking for initial page load requests', async () => {
    client.id = '2';
    await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should bypass mocking for requests with explicit bypass header', async () => {
    event.request.headers.set('x-msw-bypass', 'true');
    await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should handle MOCK_RESPONSE type', async () => {
    client.postMessage.mockResolvedValueOnce({
      type: 'MOCK_RESPONSE',
      data: {
        status: 200,
        body: 'mock response'
      }
    });
    const response = await getResponse(event, client, requestId);
    expect(response.status).toBe(200);
    expect(response.body).toBe('mock response');
  });

  test('should handle MOCK_NOT_FOUND type', async () => {
    client.postMessage.mockResolvedValueOnce({
      type: 'MOCK_NOT_FOUND'
    });
    await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should handle NETWORK_ERROR type', async () => {
    client.postMessage.mockResolvedValueOnce({
      type: 'NETWORK_ERROR',
      data: {
        name: 'NetworkError',
        message: 'Network error occurred'
      }
    });
    await expect(getResponse(event, client, requestId)).rejects.toThrow('Network error occurred');
  });
});

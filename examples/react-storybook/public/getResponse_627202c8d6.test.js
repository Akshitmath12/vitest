const getResponse = require('./mockServiceWorker');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('getResponse', () => {
  let event;
  let client;
  let requestId;

  beforeEach(() => {
    event = {
      request: {
        clone: jest.fn(),
        headers: new Map(),
        url: 'http://test.com',
        method: 'GET',
        cache: 'default',
        mode: 'cors',
        credentials: 'same-origin',
        destination: 'document',
        integrity: '',
        redirect: 'follow',
        referrer: 'about:client',
        referrerPolicy: 'no-referrer',
        text: jest.fn(),
        bodyUsed: false,
        keepalive: false,
      },
    };
    client = { id: 1, postMessage: jest.fn() };
    requestId = '123';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should bypass mocking when the client is not active', async () => {
    const response = await getResponse(event, null, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should bypass mocking when the client is not in the active clients map', async () => {
    const response = await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should bypass mocking when the request has the explicit bypass header', async () => {
    event.request.headers.set('x-msw-bypass', 'true');
    const response = await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should handle MOCK_RESPONSE message type', async () => {
    client.postMessage.mockResolvedValueOnce({ type: 'MOCK_RESPONSE', data: {} });
    const response = await getResponse(event, client, requestId);
    expect(response).toBeDefined();
  });

  test('should handle MOCK_NOT_FOUND message type', async () => {
    client.postMessage.mockResolvedValueOnce({ type: 'MOCK_NOT_FOUND' });
    const response = await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should handle NETWORK_ERROR message type', async () => {
    client.postMessage.mockResolvedValueOnce({ type: 'NETWORK_ERROR', data: { name: 'Error', message: 'Network Error' } });
    await expect(getResponse(event, client, requestId)).rejects.toThrow('Network Error');
  });
});

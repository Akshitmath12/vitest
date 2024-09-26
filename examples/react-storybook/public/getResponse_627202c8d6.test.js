// Test generated by RoostGPT for test ReactStoryBook using AI Type Open AI and AI Model gpt-4

const getResponse = require('./mockServiceWorker');
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('getResponse', () => {
  let event, client, requestId;

  beforeEach(() => {
    event = {
      request: new fetch.Request('http://test.com', {
        headers: new fetch.Headers({
          'x-msw-bypass': 'false'
        })
      })
    };
    client = { id: '1' };
    requestId = '123';
    fetch.mockClear();
  });

  test('should bypass mocking when the client is not active', async () => {
    client = null;
    const response = await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should bypass initial page load requests', async () => {
    activeClientIds.delete(client.id);
    const response = await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should bypass requests with the explicit bypass header', async () => {
    event.request.headers.set('x-msw-bypass', 'true');
    const response = await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should respond with mock when clientMessage type is MOCK_RESPONSE', async () => {
    sendToClient.mockResolvedValueOnce({ type: 'MOCK_RESPONSE', data: {} });
    const response = await getResponse(event, client, requestId);
    expect(respondWithMock).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should passthrough when clientMessage type is MOCK_NOT_FOUND', async () => {
    sendToClient.mockResolvedValueOnce({ type: 'MOCK_NOT_FOUND' });
    const response = await getResponse(event, client, requestId);
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  test('should throw network error when clientMessage type is NETWORK_ERROR', async () => {
    sendToClient.mockResolvedValueOnce({ type: 'NETWORK_ERROR', data: { name: 'NetworkError', message: 'Network error occurred' } });
    await expect(getResponse(event, client, requestId)).rejects.toThrow('Network error occurred');
  });
});

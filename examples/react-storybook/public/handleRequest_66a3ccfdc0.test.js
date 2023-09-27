const { handleRequest, resolveMainClient, getResponse } = require('./mockServiceWorker.js');

jest.mock('./mockServiceWorker.js');

describe('handleRequest function', () => {
  let event;
  let requestId;
  let client;
  let response;

  beforeEach(() => {
    event = {};
    requestId = '123';
    client = { id: '1' };
    response = {
      clone: jest.fn().mockReturnValue({
        type: 'default',
        ok: true,
        status: 200,
        statusText: 'OK',
        body: 'response body',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        redirected: false,
        text: jest.fn().mockResolvedValue('response body'),
      }),
    };
    resolveMainClient.mockResolvedValue(client);
    getResponse.mockResolvedValue(response);
  });

  test('should resolve main client and get response', async () => {
    await handleRequest(event, requestId);
    expect(resolveMainClient).toHaveBeenCalledWith(event);
    expect(getResponse).toHaveBeenCalledWith(event, client, requestId);
  });

  test('should send cloned response to client if client is active', async () => {
    const activeClientIds = new Set([client.id]);
    await handleRequest(event, requestId, activeClientIds);
    expect(response.clone).toHaveBeenCalled();
  });

  test('should return response', async () => {
    const result = await handleRequest(event, requestId);
    expect(result).toBe(response);
  });
});

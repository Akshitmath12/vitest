const { handleRequest, resolveMainClient, getResponse, sendToClient, activeClientIds } = require('./mockServiceWorker');

describe('handleRequest function', () => {
  let event;
  let requestId;
  let client;
  let response;

  beforeEach(() => {
    event = { someEvent: 'eventData' };
    requestId = '1234';
    client = { id: '5678' };
    response = {
      clone: jest.fn(() => response),
      type: 'default',
      ok: true,
      status: 200,
      statusText: 'OK',
      body: 'response body',
      text: jest.fn(() => Promise.resolve('response body')),
      headers: { entries: jest.fn(() => []) },
      redirected: false
    };

    resolveMainClient.mockResolvedValue(client);
    getResponse.mockResolvedValue(response);
    sendToClient.mockImplementation(() => {});
    activeClientIds.has.mockReturnValue(true);
  });

  test('should resolve main client and get response', async () => {
    await handleRequest(event, requestId);
    expect(resolveMainClient).toHaveBeenCalledWith(event);
    expect(getResponse).toHaveBeenCalledWith(event, client, requestId);
  });

  test('should send cloned response to client if client is active', async () => {
    await handleRequest(event, requestId);
    expect(response.clone).toHaveBeenCalled();
    expect(sendToClient).toHaveBeenCalledWith(client, {
      type: 'RESPONSE',
      payload: {
        requestId,
        type: response.type,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: await response.text(),
        headers: Object.fromEntries(response.headers.entries()),
        redirected: response.redirected
      }
    });
  });

  test('should not send response to client if client is not active', async () => {
    activeClientIds.has.mockReturnValue(false);
    await handleRequest(event, requestId);
    expect(response.clone).not.toHaveBeenCalled();
    expect(sendToClient).not.toHaveBeenCalled();
  });

  test('should return response', async () => {
    const result = await handleRequest(event, requestId);
    expect(result).toEqual(response);
  });
});

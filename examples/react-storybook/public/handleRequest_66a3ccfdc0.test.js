const { handleRequest, resolveMainClient, getResponse, sendToClient } = require('./mockServiceWorker');

jest.mock('./mockServiceWorker', () => ({
  resolveMainClient: jest.fn(),
  getResponse: jest.fn(),
  sendToClient: jest.fn(),
  activeClientIds: new Set()
}));

describe('handleRequest', () => {
  let event;
  let requestId;
  let client;
  let response;

  beforeEach(() => {
    event = {};
    requestId = '123';
    client = { id: 'abc' };
    response = {
      clone: jest.fn().mockReturnValue({
        type: 'default',
        ok: true,
        status: 200,
        statusText: 'OK',
        body: null,
        headers: { entries: jest.fn().mockReturnValue([]) },
        redirected: false
      }),
      text: jest.fn().mockResolvedValue('response body')
    };
    resolveMainClient.mockResolvedValue(client);
    getResponse.mockResolvedValue(response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve main client and get response', async () => {
    await handleRequest(event, requestId);
    expect(resolveMainClient).toHaveBeenCalledWith(event);
    expect(getResponse).toHaveBeenCalledWith(event, client, requestId);
  });

  it('should send response to client if client is active', async () => {
    activeClientIds.add(client.id);
    await handleRequest(event, requestId);
    expect(sendToClient).toHaveBeenCalledWith(client, {
      type: 'RESPONSE',
      payload: {
        requestId,
        type: response.clone().type,
        ok: response.clone().ok,
        status: response.clone().status,
        statusText: response.clone().statusText,
        body: await response.clone().text(),
        headers: Object.fromEntries(response.clone().headers.entries()),
        redirected: response.clone().redirected
      }
    });
    activeClientIds.delete(client.id);
  });

  it('should not send response to client if client is not active', async () => {
    await handleRequest(event, requestId);
    expect(sendToClient).not.toHaveBeenCalled();
  });

  it('should return response', async () => {
    const result = await handleRequest(event, requestId);
    expect(result).toEqual(response);
  });
});

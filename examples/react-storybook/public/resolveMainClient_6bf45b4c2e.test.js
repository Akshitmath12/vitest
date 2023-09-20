const { resolveMainClient } = require('./mockServiceWorker');

describe('resolveMainClient', () => {
  let event;
  let clients;

  beforeEach(() => {
    // Reset the global state before each test
    global.self = {
      clients: {
        get: jest.fn(),
        matchAll: jest.fn(),
      },
    };
    global.activeClientIds = new Set();
    event = { clientId: '123' };
  });

  test('returns the top-level client if it exists', async () => {
    const topLevelClient = { frameType: 'top-level' };
    global.self.clients.get.mockResolvedValue(topLevelClient);

    const result = await resolveMainClient(event);

    expect(result).toBe(topLevelClient);
    expect(global.self.clients.get).toHaveBeenCalledWith(event.clientId);
  });

  test('returns the first visible client that has registered the worker', async () => {
    const invisibleClient = { id: '456', visibilityState: 'hidden' };
    const visibleClient = { id: '789', visibilityState: 'visible' };
    global.activeClientIds.add(visibleClient.id);
    global.self.clients.matchAll.mockResolvedValue([invisibleClient, visibleClient]);

    const result = await resolveMainClient(event);

    expect(result).toBe(visibleClient);
    expect(global.self.clients.matchAll).toHaveBeenCalledWith({ type: 'window' });
  });

  test('returns undefined if no suitable client is found', async () => {
    global.self.clients.get.mockResolvedValue(null);
    global.self.clients.matchAll.mockResolvedValue([]);

    const result = await resolveMainClient(event);

    expect(result).toBeUndefined();
  });
});

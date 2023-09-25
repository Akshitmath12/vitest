const self = require('./mockServiceWorker.js');

jest.mock('./mockServiceWorker.js', () => ({
  addEventListener: jest.fn(),
  clients: {
    get: jest.fn(),
    matchAll: jest.fn()
  },
  registration: {
    unregister: jest.fn()
  }
}));

describe('Service Worker', () => {
  let client;
  let event;
  let sendToClient;
  let INTEGRITY_CHECKSUM;
  let activeClientIds;

  beforeEach(() => {
    sendToClient = jest.fn();
    client = { id: '123' };
    event = {
      source: client,
      data: null
    };
    INTEGRITY_CHECKSUM = 'checksum';
    activeClientIds = new Set([client.id]);
    self.clients.get.mockResolvedValue(client);
    self.clients.matchAll.mockResolvedValue([client]);
  });

  test('should handle KEEPALIVE_REQUEST', async () => {
    event.data = 'KEEPALIVE_REQUEST';
    await self.addEventListener('message', event);
    expect(sendToClient).toHaveBeenCalledWith(client, { type: 'KEEPALIVE_RESPONSE' });
  });

  test('should handle INTEGRITY_CHECK_REQUEST', async () => {
    event.data = 'INTEGRITY_CHECK_REQUEST';
    await self.addEventListener('message', event);
    expect(sendToClient).toHaveBeenCalledWith(client, { type: 'INTEGRITY_CHECK_RESPONSE', payload: INTEGRITY_CHECKSUM });
  });

  test('should handle MOCK_ACTIVATE', async () => {
    event.data = 'MOCK_ACTIVATE';
    await self.addEventListener('message', event);
    expect(sendToClient).toHaveBeenCalledWith(client, { type: 'MOCKING_ENABLED', payload: true });
  });

  test('should handle MOCK_DEACTIVATE', async () => {
    event.data = 'MOCK_DEACTIVATE';
    await self.addEventListener('message', event);
    activeClientIds.delete(client.id);
    expect(activeClientIds.has(client.id)).toBe(false);
  });

  test('should handle CLIENT_CLOSED', async () => {
    event.data = 'CLIENT_CLOSED';
    await self.addEventListener('message', event);
    activeClientIds.delete(client.id);
    expect(activeClientIds.has(client.id)).toBe(false);
    expect(self.registration.unregister).toHaveBeenCalled();
  });

  test('should return if no client id or clients', async () => {
    event.source.id = null;
    await self.addEventListener('message', event);
    expect(sendToClient).not.toHaveBeenCalled();
  });

  test('should return if no client found', async () => {
    self.clients.get.mockResolvedValue(null);
    await self.addEventListener('message', event);
    expect(sendToClient).not.toHaveBeenCalled();
  });
});

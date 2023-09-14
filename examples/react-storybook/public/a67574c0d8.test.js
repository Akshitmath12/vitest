const mockSendToClient = jest.fn();
const mockSelf = {
  addEventListener: jest.fn(),
  clients: {
    get: jest.fn(),
    matchAll: jest.fn(),
  },
  registration: {
    unregister: jest.fn(),
  },
};

jest.mock('./mockServiceWorker', () => ({
  sendToClient: mockSendToClient,
  self: mockSelf,
}));

const { self, sendToClient } = require('./mockServiceWorker');

describe('addEventListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return early if clientId or clients is not available', async () => {
    self.clients = null;
    await self.addEventListener.mock.calls[0][1]({ source: { id: null } });
    expect(mockSelf.clients.get).not.toHaveBeenCalled();
  });

  test('should return early if client is not available', async () => {
    self.clients.get.mockResolvedValue(null);
    await self.addEventListener.mock.calls[0][1]({ source: { id: 'clientId' } });
    expect(mockSendToClient).not.toHaveBeenCalled();
  });

  test('should handle KEEPALIVE_REQUEST', async () => {
    self.clients.get.mockResolvedValue('client');
    await self.addEventListener.mock.calls[0][1]({ source: { id: 'clientId' }, data: 'KEEPALIVE_REQUEST' });
    expect(mockSendToClient).toHaveBeenCalledWith('client', { type: 'KEEPALIVE_RESPONSE' });
  });

  test('should handle INTEGRITY_CHECK_REQUEST', async () => {
    self.clients.get.mockResolvedValue('client');
    await self.addEventListener.mock.calls[0][1]({ source: { id: 'clientId' }, data: 'INTEGRITY_CHECK_REQUEST' });
    expect(mockSendToClient).toHaveBeenCalledWith('client', { type: 'INTEGRITY_CHECK_RESPONSE', payload: INTEGRITY_CHECKSUM });
  });

  test('should handle MOCK_ACTIVATE', async () => {
    self.clients.get.mockResolvedValue('client');
    await self.addEventListener.mock.calls[0][1]({ source: { id: 'clientId' }, data: 'MOCK_ACTIVATE' });
    expect(mockSendToClient).toHaveBeenCalledWith('client', { type: 'MOCKING_ENABLED', payload: true });
  });

  test('should handle CLIENT_CLOSED and unregister itself', async () => {
    self.clients.get.mockResolvedValue('client');
    self.clients.matchAll.mockResolvedValue([{ id: 'otherClientId' }]);
    await self.addEventListener.mock.calls[0][1]({ source: { id: 'clientId' }, data: 'CLIENT_CLOSED' });
    expect(self.registration.unregister).toHaveBeenCalled();
  });
});

const mockClients = {
  get: jest.fn(),
  matchAll: jest.fn(),
};
const mockSendToClient = jest.fn();

jest.mock('./mockServiceWorker', () => ({
  self: {
    addEventListener: jest.fn(),
    clients: mockClients,
  },
  sendToClient: mockSendToClient,
}));

describe('message event listener', () => {
  let self;

  beforeEach(() => {
    const module = require('./mockServiceWorker');
    self = module.self;
    self.addEventListener.mock.calls[0][1]({ source: { id: 'testId' }, data: 'KEEPALIVE_REQUEST' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle KEEPALIVE_REQUEST', async () => {
    mockClients.get.mockResolvedValueOnce({});

    await Promise.resolve();

    expect(mockSendToClient).toHaveBeenCalledWith({}, { type: 'KEEPALIVE_RESPONSE' });
  });

  test('should handle INTEGRITY_CHECK_REQUEST', async () => {
    mockClients.get.mockResolvedValueOnce({});

    self.addEventListener.mock.calls[0][1]({ source: { id: 'testId' }, data: 'INTEGRITY_CHECK_REQUEST' });

    await Promise.resolve();

    expect(mockSendToClient).toHaveBeenCalledWith({}, { type: 'INTEGRITY_CHECK_RESPONSE', payload: INTEGRITY_CHECKSUM });
  });

  test('should handle MOCK_ACTIVATE', async () => {
    mockClients.get.mockResolvedValueOnce({});

    self.addEventListener.mock.calls[0][1]({ source: { id: 'testId' }, data: 'MOCK_ACTIVATE' });

    await Promise.resolve();

    expect(mockSendToClient).toHaveBeenCalledWith({}, { type: 'MOCKING_ENABLED', payload: true });
  });

  test('should handle MOCK_DEACTIVATE', async () => {
    mockClients.get.mockResolvedValueOnce({});

    self.addEventListener.mock.calls[0][1]({ source: { id: 'testId' }, data: 'MOCK_DEACTIVATE' });

    await Promise.resolve();

    expect(activeClientIds.has('testId')).toBe(false);
  });

  test('should handle CLIENT_CLOSED', async () => {
    mockClients.get.mockResolvedValueOnce({});
    mockClients.matchAll.mockResolvedValueOnce([{ id: 'otherId' }]);

    self.addEventListener.mock.calls[0][1]({ source: { id: 'testId' }, data: 'CLIENT_CLOSED' });

    await Promise.resolve();

    expect(activeClientIds.has('testId')).toBe(false);
    expect(self.registration.unregister).not.toHaveBeenCalled();
  });
});

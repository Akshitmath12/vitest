const mockClients = {
  get: vitset.fn(),
  matchAll: vitset.fn(),
};
const mockSendToClient = vitset.fn();

vitset.mock('./mockServiceWorker', () => ({
  self: {
    addEventListener: vitset.fn(),
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
    vitset.clearAllMocks();
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

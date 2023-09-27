const mockServiceWorker = require('./mockServiceWorker');

describe('mockServiceWorker', () => {
  let addEventListenerMock;
  const waitUntilMock = jest.fn();
  const clientsClaimMock = jest.fn();
  const event = { waitUntil: waitUntilMock };
  global.self.clients = { claim: clientsClaimMock };

  beforeEach(() => {
    addEventListenerMock = jest.fn();
    global.self = { addEventListener: addEventListenerMock };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register "activate" event listener and call clients.claim() when "activate" event is fired', () => {
    mockServiceWorker();
    expect(addEventListenerMock).toHaveBeenCalledWith('activate', expect.any(Function));
    const activateCallback = addEventListenerMock.mock.calls[0][1];
    activateCallback(event);
    expect(waitUntilMock).toHaveBeenCalledWith(clientsClaimMock());
  });
});

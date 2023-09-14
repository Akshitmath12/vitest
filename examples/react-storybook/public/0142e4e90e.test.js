const mockServiceWorker = require('./mockServiceWorker');

describe('mockServiceWorker', () => {
  let addEventListenerMock;

  beforeEach(() => {
    addEventListenerMock = jest.fn();
    global.self = { addEventListener: addEventListenerMock };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register "activate" event listener', () => {
    mockServiceWorker();
    expect(addEventListenerMock).toHaveBeenCalledWith('activate', expect.any(Function));
  });

  test('should call clients.claim() when "activate" event is fired', () => {
    const waitUntilMock = jest.fn();
    const clientsClaimMock = jest.fn();
    global.self.clients = { claim: clientsClaimMock };
    const event = { waitUntil: waitUntilMock };

    mockServiceWorker();
    const activateCallback = addEventListenerMock.mock.calls[0][1];
    activateCallback(event);

    expect(waitUntilMock).toHaveBeenCalledWith(clientsClaimMock());
  });
});

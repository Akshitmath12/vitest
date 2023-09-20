const mockServiceWorker = require('./mockServiceWorker');

describe('mockServiceWorker', () => {
  let addEventListenerSpy;

  beforeAll(() => {
    global.self = {};
    addEventListenerSpy = jest.spyOn(global.self, 'addEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockClear();
  });

  afterAll(() => {
    addEventListenerSpy.mockRestore();
  });

  test('should call addEventListener with "activate" event', () => {
    mockServiceWorker();
    expect(addEventListenerSpy).toHaveBeenCalledWith('activate', expect.any(Function));
  });

  test('should call clients.claim() when "activate" event is fired', () => {
    const mockEvent = {
      waitUntil: jest.fn(),
    };

    const mockClients = {
      claim: jest.fn(),
    };

    global.self.clients = mockClients;

    mockServiceWorker();

    const activateCallback = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'activate'
    )[1];

    activateCallback(mockEvent);

    expect(mockEvent.waitUntil).toHaveBeenCalledWith(mockClients.claim());
  });
});

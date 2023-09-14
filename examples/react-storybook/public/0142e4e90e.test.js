const mockServiceWorker = require('./mockServiceWorker');

describe('mockServiceWorker', () => {
  let addEventListenerSpy;
  global.self = {};

  beforeAll(() => {
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

  test('should call clients.claim when "activate" event is fired', () => {
    const waitUntilSpy = jest.fn();
    const event = { waitUntil: waitUntilSpy };
    global.self.clients = { claim: jest.fn() };
    const clientsClaimSpy = jest.spyOn(global.self.clients, 'claim');

    addEventListenerSpy.mockImplementation((event, callback) => {
      if (event === 'activate') {
        callback(event);
      }
    });

    mockServiceWorker();
    expect(clientsClaimSpy).toHaveBeenCalled();
    expect(waitUntilSpy).toHaveBeenCalledWith(clientsClaimSpy);
  });
});

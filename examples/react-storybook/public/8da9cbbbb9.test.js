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

  test('should call addEventListener with "install" event', () => {
    mockServiceWorker();
    expect(addEventListenerSpy).toHaveBeenCalledWith('install', expect.any(Function));
  });

  test('should call skipWaiting when "install" event is fired', () => {
    const skipWaitingSpy = jest.spyOn(global.self, 'skipWaiting');
    mockServiceWorker();
    
    const installCallback = addEventListenerSpy.mock.calls.find(call => call[0] === 'install')[1];
    installCallback();

    expect(skipWaitingSpy).toHaveBeenCalled();

    skipWaitingSpy.mockRestore();
  });
});

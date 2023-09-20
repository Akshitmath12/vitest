const mockServiceWorker = require('./mockServiceWorker');

describe('Service Worker Install Event', () => {
  let addEventListener;
  let skipWaiting;

  beforeAll(() => {
    // Mock the global 'self' object
    global.self = {
      addEventListener: jest.fn(),
      skipWaiting: jest.fn(),
    };

    addEventListener = global.self.addEventListener;
    skipWaiting = global.self.skipWaiting;

    // Run the service worker script
    mockServiceWorker();
  });

  test('should add event listener for install event', () => {
    expect(addEventListener).toHaveBeenCalledWith('install', expect.any(Function));
  });

  test('should call skipWaiting when install event is triggered', () => {
    const installCallback = addEventListener.mock.calls[0][1];
    installCallback();
    expect(skipWaiting).toHaveBeenCalled();
  });
});

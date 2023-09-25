const mockServiceWorker = require('./mockServiceWorker');

describe('mockServiceWorker', () => {
  let installEvent;
  let skipWaitingSpy;

  beforeEach(() => {
    skipWaitingSpy = jest.fn();

    installEvent = {
      waitUntil: jest.fn((cb) => cb()),
      skipWaiting: skipWaitingSpy,
    };

    global.self = {
      addEventListener: jest.fn((event, cb) => cb(installEvent)),
      skipWaiting: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call self.skipWaiting when install event is triggered', () => {
    mockServiceWorker();
    expect(global.self.skipWaiting).toHaveBeenCalled();
  });

  test('should not call self.skipWaiting when other events are triggered', () => {
    global.self.addEventListener = jest.fn((event, cb) => {
      if (event !== 'install') {
        cb(installEvent);
      }
    });

    mockServiceWorker();
    expect(global.self.skipWaiting).not.toHaveBeenCalled();
  });
});

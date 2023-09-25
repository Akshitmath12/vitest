const fetchEvent = require('./mockServiceWorker');
const handleRequest = jest.fn();

jest.mock('./handleRequest', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('fetch event listener', () => {
  let addEventListener;
  let removeEventListener;

  beforeAll(() => {
    addEventListener = global.self.addEventListener;
    removeEventListener = global.self.removeEventListener;
    global.self.addEventListener = jest.fn();
    global.self.removeEventListener = jest.fn();
  });

  afterAll(() => {
    global.self.addEventListener = addEventListener;
    global.self.removeEventListener = removeEventListener;
  });

  beforeEach(() => {
    global.self.addEventListener.mockClear();
    global.self.removeEventListener.mockClear();
    handleRequest.mockClear();
  });

  test('bypasses server-sent events', () => {
    const event = {
      request: {
        headers: {
          get: () => 'text/event-stream',
        },
        mode: 'navigate',
        cache: 'default',
      },
      respondWith: jest.fn(),
    };

    fetchEvent(event);
    expect(handleRequest).not.toHaveBeenCalled();
  });

  test('bypasses navigation requests', () => {
    const event = {
      request: {
        headers: {
          get: () => 'text/html',
        },
        mode: 'navigate',
        cache: 'default',
      },
      respondWith: jest.fn(),
    };

    fetchEvent(event);
    expect(handleRequest).not.toHaveBeenCalled();
  });

  test('bypasses "only-if-cached" requests from different origin', () => {
    const event = {
      request: {
        headers: {
          get: () => 'text/html',
        },
        mode: 'no-cors',
        cache: 'only-if-cached',
      },
      respondWith: jest.fn(),
    };

    fetchEvent(event);
    expect(handleRequest).not.toHaveBeenCalled();
  });

  test('handles request when there are active clients', () => {
    activeClientIds = new Set(['client1']);
    const event = {
      request: {
        headers: {
          get: () => 'text/html',
        },
        mode: 'same-origin',
        cache: 'default',
      },
      respondWith: jest.fn(),
    };

    fetchEvent(event);
    expect(handleRequest).toHaveBeenCalled();
  });
});

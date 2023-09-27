const fetchEvent = require('./mockServiceWorker');
const handleRequest = jest.fn();

describe('fetch event listener', () => {
  let event;

  beforeEach(() => {
    event = {
      request: {
        headers: {
          get: jest.fn(),
        },
        mode: '',
        cache: '',
      },
      respondWith: jest.fn(),
    };
  });

  test('bypasses server-sent events', () => {
    event.request.headers.get.mockReturnValue('text/event-stream');
    fetchEvent(event);
    expect(handleRequest).not.toHaveBeenCalled();
  });

  test('bypasses navigation requests', () => {
    event.request.mode = 'navigate';
    fetchEvent(event);
    expect(handleRequest).not.toHaveBeenCalled();
  });

  test('bypasses only-if-cached requests not from same-origin', () => {
    event.request.cache = 'only-if-cached';
    event.request.mode = 'no-cors';
    fetchEvent(event);
    expect(handleRequest).not.toHaveBeenCalled();
  });

  test('handles valid requests', () => {
    handleRequest.mockReturnValue(Promise.resolve());
    fetchEvent(event);
    expect(handleRequest).toHaveBeenCalled();
  });

  test('handles request failures', () => {
    const error = new Error('NetworkError');
    handleRequest.mockReturnValue(Promise.reject(error));
    fetchEvent(event);
    expect(event.respondWith).toHaveBeenCalled();
  });
});

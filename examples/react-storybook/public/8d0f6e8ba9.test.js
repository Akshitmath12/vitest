const { handleRequest } = require('./mockServiceWorker');

// Mocking console.warn and console.error
console.warn = jest.fn();
console.error = jest.fn();

describe('Fetch event listener', () => {
  let fetchEvent;

  beforeEach(() => {
    fetchEvent = {
      request: {
        headers: new Map(),
        mode: 'same-origin',
        cache: 'default',
        method: 'GET',
        url: 'http://localhost/test',
      },
      respondWith: jest.fn(),
    };
  });

  test('should bypass server-sent events', () => {
    fetchEvent.request.headers.set('accept', 'text/event-stream');
    global.dispatchEvent(new FetchEvent('fetch', { request: fetchEvent.request }));
    expect(fetchEvent.respondWith).not.toHaveBeenCalled();
  });

  test('should bypass navigation requests', () => {
    fetchEvent.request.mode = 'navigate';
    global.dispatchEvent(new FetchEvent('fetch', { request: fetchEvent.request }));
    expect(fetchEvent.respondWith).not.toHaveBeenCalled();
  });

  test('should bypass only-if-cached from different origin', () => {
    fetchEvent.request.cache = 'only-if-cached';
    fetchEvent.request.mode = 'cors';
    global.dispatchEvent(new FetchEvent('fetch', { request: fetchEvent.request }));
    expect(fetchEvent.respondWith).not.toHaveBeenCalled();
  });

  test('should bypass all requests when there are no active clients', () => {
    global.activeClientIds = new Set();
    global.dispatchEvent(new FetchEvent('fetch', { request: fetchEvent.request }));
    expect(fetchEvent.respondWith).not.toHaveBeenCalled();
  });

  test('should handle request and respond with result', async () => {
    global.activeClientIds = new Set(['client1']);
    const mockResponse = new Response('test response');
    handleRequest.mockResolvedValue(mockResponse);
    global.dispatchEvent(new FetchEvent('fetch', { request: fetchEvent.request }));
    expect(fetchEvent.respondWith).toHaveBeenCalledWith(Promise.resolve(mockResponse));
  });

  test('should handle NetworkError and warn', async () => {
    global.activeClientIds = new Set(['client1']);
    const networkError = new Error('Network error');
    networkError.name = 'NetworkError';
    handleRequest.mockRejectedValue(networkError);
    global.dispatchEvent(new FetchEvent('fetch', { request: fetchEvent.request }));
    expect(console.warn).toHaveBeenCalledWith('[MSW] Successfully emulated a network error for the "GET http://localhost/test" request.');
  });

  test('should handle other errors and log error', async () => {
    global.activeClientIds = new Set(['client1']);
    const otherError = new Error('Other error');
    handleRequest.mockRejectedValue(otherError);
    global.dispatchEvent(new FetchEvent('fetch', { request: fetchEvent.request }));
    expect(console.error).toHaveBeenCalledWith(`[MSW] Caught an exception from the "GET http://localhost/test" request (Error: Other error). This is probably not a problem with Mock Service Worker. There is likely an additional logging output above.`);
  });
});

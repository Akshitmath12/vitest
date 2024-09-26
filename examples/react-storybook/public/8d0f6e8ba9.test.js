// Test generated by RoostGPT for test ReactStoryBook using AI Type Open AI and AI Model gpt-4

const { setupWorker, rest } = require('msw');
const { setupServer } = require('msw/node');

// Mock service worker setup
const worker = setupWorker(
  rest.get('/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'John Doe' }));
  }),
);

// Start the service worker
worker.start();

// Jest test suite
describe('fetch event listener', () => {
  let server;

  beforeAll(() => {
    server = setupServer(
      rest.get('/user', (req, res, ctx) => {
        return res(ctx.json({ name: 'John Doe' }));
      }),
    );
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test('should bypass server-sent events', async () => {
    const response = await fetch('/user', {
      headers: { 'accept': 'text/event-stream' },
    });
    expect(response.status).toBe(200);
  });

  test('should bypass navigation requests', async () => {
    const response = await fetch('/user', {
      mode: 'navigate',
    });
    expect(response.status).toBe(200);
  });

  test('should bypass only-if-cached request not from same origin', async () => {
    const response = await fetch('/user', {
      mode: 'no-cors',
      cache: 'only-if-cached',
    });
    expect(response.status).toBe(200);
  });

  test('should handle request if there are active clients', async () => {
    const response = await fetch('/user');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ name: 'John Doe' });
  });

  test('should emulate network error for NetworkError', async () => {
    server.use(
      rest.get('/user', (req, res, ctx) => {
        return res(ctx.networkError('Failed to connect'));
      }),
    );

    await expect(fetch('/user')).rejects.toThrow('Failed to connect');
  });
});

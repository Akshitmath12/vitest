const fetch = require('node-fetch');
global.fetch = fetch;
const { setupServer } = require('msw/node');
const { rest } = require('msw');

const server = setupServer();

describe('passthrough function', () => {
  let clonedRequest;

  beforeEach(() => {
    clonedRequest = new Request('https://test.com', {
      method: 'GET',
      headers: new Headers({
        'x-msw-bypass': 'test',
      }),
    });

    server.listen();
  });

  afterEach(() => {
    server.close();
  });

  test('should remove x-msw-bypass header and send request', async () => {
    server.use(
      rest.get('https://test.com', (req, res, ctx) => {
        if (req.headers.get('x-msw-bypass')) {
          return res(ctx.status(200));
        }
      })
    );

    const response = await fetch(clonedRequest);
    expect(response.headers.get('x-msw-bypass')).toBeNull();
    expect(response.status).toBe(200);
  });

  test('should throw an error if request fails', async () => {
    clonedRequest = new Request('https://invalidurl', {
      method: 'GET',
      headers: new Headers({
        'x-msw-bypass': 'test',
      }),
    });

    server.use(
      rest.get('https://invalidurl', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(fetch(clonedRequest)).rejects.toThrow();
  });
});

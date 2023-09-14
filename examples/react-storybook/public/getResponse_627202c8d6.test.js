const { getResponse } = require('./mockServiceWorker');
const fetch = require('node-fetch');
const http = require('http');

global.self = {
  addEventListener: jest.fn(),
  skipWaiting: jest.fn(),
};

jest.mock('node-fetch', () => jest.fn());

describe('getResponse', () => {
  let event;
  let client;
  let requestId;
  let server;

  beforeAll(() => {
    server = http.createServer().listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    event = {
      request: new fetch.Request('http://localhost:3000', {
        method: 'GET',
        headers: {
          'x-msw-bypass': 'false',
        },
      }),
    };
    client = {
      id: '1',
    };
    requestId = '1';
  });

  afterEach(() => {
    fetch.mockClear();
  });

  test('should return mocked response', async () => {
    const mockResponse = new fetch.Response('mock response');
    fetch.mockImplementationOnce(() => Promise.resolve(mockResponse));

    const response = await getResponse(event, client, requestId);

    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(event.request, { headers: {} });
  });

  test('should bypass request when client is not active', async () => {
    client = null;
    const realResponse = new fetch.Response('real response');
    fetch.mockImplementationOnce(() => Promise.resolve(realResponse));

    const response = await getResponse(event, client, requestId);

    expect(response).toEqual(realResponse);
    expect(fetch).toHaveBeenCalledWith(event.request, { headers: {} });
  });

  // Add more test cases as needed...
});

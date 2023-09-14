const { sendToClient } = require('./mockServiceWorker');

describe('sendToClient', () => {
  let client;
  let message;
  let postMessageMock;

  beforeEach(() => {
    postMessageMock = jest.fn();
    client = {
      postMessage: postMessageMock,
    };
    message = {};
  });

  it('should resolve with the event data when there is no error', async () => {
    const expectedData = { data: 'test' };
    const channel = new MessageChannel();
    channel.port1.onmessage = event => {
      event.data = expectedData;
    };

    const promise = sendToClient(client, message);
    channel.port1.dispatchEvent(new MessageEvent('message', { data: expectedData }));

    await expect(promise).resolves.toEqual(expectedData);
    expect(postMessageMock).toHaveBeenCalledWith(message, [channel.port2]);
  });

  it('should reject with the error message when there is an error', async () => {
    const expectedError = 'test error';
    const channel = new MessageChannel();
    channel.port1.onmessage = event => {
      event.data = { error: expectedError };
    };

    const promise = sendToClient(client, message);
    channel.port1.dispatchEvent(new MessageEvent('message', { data: { error: expectedError } }));

    await expect(promise).rejects.toEqual(expectedError);
    expect(postMessageMock).toHaveBeenCalledWith(message, [channel.port2]);
  });
});

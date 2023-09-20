const { sendToClient } = require('./mockServiceWorker');

describe('sendToClient', () => {
  let client;
  let message;
  let mockPostMessage;

  beforeEach(() => {
    message = { text: 'Test message' };
    mockPostMessage = jest.fn();

    client = {
      postMessage: mockPostMessage,
    };

    global.MessageChannel = jest.fn(() => ({
      port1: {
        onmessage: null,
      },
      port2: {},
    }));
  });

  it('should resolve with event data when no error occurs', async () => {
    const data = { text: 'Response data' };

    const promise = sendToClient(client, message);

    const { port1 } = new MessageChannel();
    port1.onmessage({ data });

    await expect(promise).resolves.toEqual(data);
    expect(mockPostMessage).toHaveBeenCalledWith(message, [new MessageChannel().port2]);
  });

  it('should reject with error when error occurs', async () => {
    const error = new Error('Test error');

    const promise = sendToClient(client, message);

    const { port1 } = new MessageChannel();
    port1.onmessage({ data: { error } });

    await expect(promise).rejects.toEqual(error);
    expect(mockPostMessage).toHaveBeenCalledWith(message, [new MessageChannel().port2]);
  });
});

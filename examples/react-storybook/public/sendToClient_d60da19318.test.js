// Test generated by RoostGPT for test ReactStoryBook using AI Type Open AI and AI Model gpt-4

const { sendToClient } = require('./mockServiceWorker');

describe('sendToClient', () => {
  let client;
  let message;

  beforeEach(() => {
    client = {
      postMessage: jest.fn(),
    };
    message = 'test message';
  });

  test('should send message to client and resolve with response data', () => {
    const data = 'response data';
    const event = { data };
    const channel = {
      port1: {
        onmessage: null,
      },
      port2: {},
    };
    global.MessageChannel = jest.fn(() => channel);

    const promise = sendToClient(client, message);
    channel.port1.onmessage(event);

    expect(client.postMessage).toHaveBeenCalledWith(message, [channel.port2]);
    return expect(promise).resolves.toBe(data);
  });

  test('should send message to client and reject with error if error in response data', () => {
    const error = 'error';
    const event = { data: { error } };
    const channel = {
      port1: {
        onmessage: null,
      },
      port2: {},
    };
    global.MessageChannel = jest.fn(() => channel);

    const promise = sendToClient(client, message);
    channel.port1.onmessage(event);

    expect(client.postMessage).toHaveBeenCalledWith(message, [channel.port2]);
    return expect(promise).rejects.toBe(error);
  });
});

const { setGlobalConfig } = require('@storybook/testing-react');
const { getWorker } = require('msw-storybook-addon');
const globalStorybookConfig = require('../.storybook/preview');

setGlobalConfig(globalStorybookConfig);

describe('Test suite for getWorker close method', () => {
  let worker;
  let closeSpy;

  beforeAll(() => {
    worker = getWorker();
    closeSpy = jest.spyOn(worker, 'close');
  });

  test('should successfully close the worker', () => {
    worker.close();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if worker is already closed', () => {
    expect(() => worker.close()).toThrow();
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  afterAll(() => {
    closeSpy.mockRestore();
    if (!closeSpy.mock.calls.length) {
      worker.close();
    }
  });
});

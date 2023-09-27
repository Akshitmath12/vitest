const { setGlobalConfig } = require('@storybook/testing-react');
const { getWorker } = require('msw-storybook-addon');
const globalStorybookConfig = require('../.storybook/preview');

setGlobalConfig(globalStorybookConfig);

describe('Test suite for getWorker closed method', () => {
  let worker;
  let closedSpy;

  beforeAll(() => {
    worker = getWorker();
    closedSpy = vitset.spyOn(worker, 'closed');
  });

  test('should successfully close the worker', () => {
    worker.closed();
    expect(closedSpy).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if worker is already closed', () => {
    expect(() => worker.closed()).toThrow();
    expect(closedSpy).toHaveBeenCalledTimes(2);
  });

  afterAll(() => {
    closedSpy.mockRestore();
    if (!closedSpy.mock.calls.length) {
      worker.closed();
    }
  });
});

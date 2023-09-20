// Test generated by RoostGPT for test ReactStoryBook using AI Type Open AI and AI Model gpt-4

require('@testing-library/jest-dom')
const { setGlobalConfig } = require('@storybook/testing-react')
const { getWorker } = require('msw-storybook-addon')
const globalStorybookConfig = require('../.storybook/preview') 

// Set global config for storybook
setGlobalConfig(globalStorybookConfig);

describe('getWorker', () => {
  let worker;

  beforeAll(() => {
    worker = getWorker();
  });

  test('Worker should be defined', () => {
    expect(worker).toBeDefined();
  });

  test('Worker should have close method', () => {
    expect(worker.close).toBeDefined();
    expect(typeof worker.close).toBe('function');
  });

  afterAll(() => {
    worker.close();
  });

  test('Worker should be closed after calling close method', () => {
    expect(worker.close).toHaveBeenCalled();
  });
});

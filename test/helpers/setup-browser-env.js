const browserEnv = require('browser-env');
const MockDomStorage = require('mock-dom-storage');

browserEnv();

Object.defineProperties(window, {
  localStorage: {
    configurable: true,
    enumerable: false,
    value: MockDomStorage(),
    writable: true,
  },
  sessionStorage: {
    configurable: true,
    enumerable: false,
    value: MockDomStorage(),
    writable: true,
  },
});

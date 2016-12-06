const browserEnv = require('browser-env');
const MockDomStorage = require('mock-dom-storage');

browserEnv();

window.localStorage = MockDomStorage();
window.sessionStorage = MockDomStorage();

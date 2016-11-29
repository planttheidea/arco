import test from 'ava';
import isFunction from 'lodash';
import sinon from 'sinon';

import {
  addWindowUnloadListener,
  createRestorableStateStore,
  createStore,
  getEnhancers,
  getReducerMap
} from 'src/store';

test('if addWindowUnloadListener adds an event listener to the window object', (t) => {
  const stub = sinon.stub(window, 'addEventListener');

  const store = {};

  addWindowUnloadListener(store);

  t.true(stub.calledOnce);

  stub.restore();
});

test.todo('createRestorableStateStore');
test.todo('createStore');
test.todo('getEnhancers');
test.todo('getReducerMap');
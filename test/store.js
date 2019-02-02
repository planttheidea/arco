import test from 'ava';
import isFunction from 'lodash/isFunction';
import sinon from 'sinon';

import {
  LOCATION_CHANGE,
  routerReducer,
} from 'react-router-redux';

import {
  addWindowUnloadListener,
  createRestorableStateStore,
  createStore,
  getComposedEnhancers,
  getReducerMap,
  immutableRouterReducer,
} from 'src/store';

import {ARCO_STATE_KEY} from 'src/constants';

test('if addWindowUnloadListener adds an event listener to the window object', (t) => {
  const stub = sinon.stub(window, 'addEventListener');

  const store = {};

  addWindowUnloadListener(store);

  t.true(stub.calledOnce);

  stub.restore();
});

test('if addWindowUnloadListener will get the store state and save it in sessionStorage', (t) => {
  const state = {
    foo: 'bar',
  };
  const store = {
    getState() {
      return state;
    },
  };

  addWindowUnloadListener(store);

  const unloadEvent = document.createEvent('Event');

  unloadEvent.initEvent('beforeunload', true, true);

  window.dispatchEvent(unloadEvent);

  const result = window.sessionStorage.getItem(ARCO_STATE_KEY);

  t.is(result, JSON.stringify(state));
});

test('if createRestorableStateStore will create a redux store', (t) => {
  const enhancers = getComposedEnhancers([], true);
  const initialState = {
    foo: 'bar',
  };
  const result = createRestorableStateStore(() => {}, enhancers, initialState);

  t.true(isFunction(result.dispatch));
  t.true(isFunction(result.subscribe));
  t.true(isFunction(result.getState));
  t.true(isFunction(result.replaceReducer));
});

test('if createRestorableStateStore will parse the state in storage if it exists', (t) => {
  window.sessionStorage.setItem(
    ARCO_STATE_KEY,
    JSON.stringify({
      foo: 'bar',
    })
  );

  const parseSpy = sinon.spy(JSON, 'parse');
  const addEventListenerSpy = sinon.spy(window, 'addEventListener');

  const enhancers = getComposedEnhancers([], true);

  createRestorableStateStore(() => {}, enhancers, {});

  t.true(parseSpy.calledOnce);
  t.true(addEventListenerSpy.calledOnce);

  parseSpy.restore();
  addEventListenerSpy.restore();

  window.sessionStorage.removeItem(ARCO_STATE_KEY);
});

test('if createStore creates a store when autoRestore is false', (t) => {
  const reducer = (state = {}) => state;

  reducer.namespace = 'app';

  const result = createStore([reducer]);

  t.true(isFunction(result.dispatch));
  t.true(isFunction(result.subscribe));
  t.true(isFunction(result.getState));
  t.true(isFunction(result.replaceReducer));
});

test('if createStore creates a store when autoRestore is true', (t) => {
  const reducer = (state = {}) => state;

  reducer.namespace = 'app';

  const result = createStore([reducer], {
    autoRestore: true,
  });

  t.true(isFunction(result.dispatch));
  t.true(isFunction(result.subscribe));
  t.true(isFunction(result.getState));
  t.true(isFunction(result.replaceReducer));
});

test('if getComposedEnhancers returns undefined when no middlewares are used', (t) => {
  const result = getComposedEnhancers([], false);

  t.is(result, undefined);
});

test('if getComposedEnhancers returns a function when middlewares exist', (t) => {
  const result = getComposedEnhancers([() => {}]);

  t.true(isFunction(result));
});

test('if getReducerMap returns a map of namespace => reducer combinations', (t) => {
  const fn1 = () => {};
  const fn2 = () => {};

  fn1.namespace = 'fn1';
  fn2.namespace = 'fn2';

  const result = getReducerMap([fn1, fn2], false, false);

  t.deepEqual(result, {
    fn1,
    fn2,
  });
});

test('if getReducerMap appends the routerReducer if history is set to true', (t) => {
  const fn1 = () => {};
  const fn2 = () => {};

  fn1.namespace = 'fn1';
  fn2.namespace = 'fn2';

  const result = getReducerMap([fn1, fn2], true, false);

  t.deepEqual(result, {
    fn1,
    fn2,
    routing: routerReducer,
  });
});

test('if getReducerMap appends the immutableRouterReducer if history and isImmutable are set to true', (t) => {
  const fn1 = () => {};
  const fn2 = () => {};

  fn1.namespace = 'fn1';
  fn2.namespace = 'fn2';

  const result = getReducerMap([fn1, fn2], true, true);

  t.deepEqual(result, {
    fn1,
    fn2,
    routing: immutableRouterReducer,
  });
});

test('if immutableRouterReducer returns correctly based on type', (t) => {
  const state = {
    set(key, value) {
      return {
        [key]: value,
      };
    },
  };

  const notChangeResult = immutableRouterReducer(state, {type: 'FOO'});

  t.is(notChangeResult, state);

  const changeResult = immutableRouterReducer(state, {
    payload: 'foo',
    type: LOCATION_CHANGE,
  });

  t.deepEqual(changeResult, {
    locationBeforeTransitions: 'foo',
  });
});

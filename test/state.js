import test from 'ava';
import sinon from 'sinon';

import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';

import {
  asyncActionStatusCreator,
  createModule,
  createNamespacedName,
  getCreateAction,
  getCreateAsyncAction,
  getCreateReducer,
  getModules
} from 'src/state';

test('if asyncActionStatusCreator returns a function that returns an object with the status passed', (t) => {
  const foo = 'foo';
  const result = asyncActionStatusCreator(foo);

  t.true(isFunction(result));

  const status = result();

  t.deepEqual(status, {
    status: foo
  });
});

test('if createNamespacedName returns a slash-separated string of namespace and name', (t) => {
  const namespace = 'foo';
  const name = 'bar';

  const expectedResult = `${namespace}/${name}`;
  const result = createNamespacedName(namespace, name);

  t.is(result, expectedResult);
});

test('if createModule will create a module and return create functions for actions and reducer', (t) => {
  const namespace = 'foo_create';

  const result = createModule(namespace);

  t.true(isPlainObject(result));
  t.deepEqual(Object.keys(result), ['createAction', 'createAsyncAction', 'createReducer', 'namespace']);
  t.true(isFunction(result.createAction));
  t.true(isFunction(result.createAsyncAction));
  t.true(isFunction(result.createReducer));
  t.is(result.namespace, namespace);
});

test('if createModule throws when the namespace already exists', (t) => {
  const namespace = 'foo_exists';

  createModule(namespace);

  t.throws(() => {
    createModule(namespace);
  });
});

test('if getCreateAction returns a function which will create a redux action', (t) => {
  const namespace = 'foo_sync';

  createModule(namespace);

  const actionCreator = getCreateAction(namespace);

  t.true(isFunction(actionCreator));

  const FOO_BAR = 'FOO_BAR';
  const action = actionCreator(FOO_BAR);

  t.true(isFunction(action));
  t.is(action.toString(), `${namespace}/${FOO_BAR}`);

  const module = getModules(namespace);
  const actionObject = module.actions[FOO_BAR];

  t.true(isPlainObject(actionObject));
  t.deepEqual(Object.keys(actionObject), ['action', 'constantName']);
  t.true(isFunction(actionObject.action));
  t.is(actionObject.constantName, `${namespace}/${FOO_BAR}`);
});

test('if getCreateAsyncAction will create three actions related to the status of the request and add them to the action', (t) => {
  const namespace = 'foo_async';

  createModule(namespace);

  const actionCreator = getCreateAsyncAction(namespace);

  t.true(isFunction(actionCreator));

  const FOO_BAR = 'FOO_BAR';
  const handler = sinon.spy((lifecycle) => {
    const {
      onRequest,
      onError,
      onSuccess
    } = lifecycle;

    t.true(isFunction(onRequest));
    t.true(isFunction(onError));
    t.true(isFunction(onSuccess));
  });

  const action = actionCreator(FOO_BAR, handler);

  action('foo');

  t.true(handler.calledOnce);

  t.true(isFunction(action));
  t.is(action.toString(), `${namespace}/${FOO_BAR}`);
  t.true(isFunction(action.onRequest));
  t.true(isFunction(action.onError));
  t.true(isFunction(action.onSuccess));

  const module = getModules(namespace);
  const actionObject = module.actions[FOO_BAR];

  t.true(isPlainObject(actionObject));
  t.deepEqual(Object.keys(actionObject), ['action', 'constantName']);
  t.true(isFunction(actionObject.action));
  t.true(isFunction(actionObject.action.onRequest));
  t.true(isFunction(actionObject.action.onError));
  t.true(isFunction(actionObject.action.onSuccess));
  t.is(actionObject.constantName, `${namespace}/${FOO_BAR}`);
});

test('if getCreateReducer returns a function that will create a reducer for the namespace', (t) => {
  const namespace = 'foo_reducer';

  createModule(namespace);

  const createReducer = getCreateReducer(namespace);

  t.true(isFunction(createReducer));

  const initialState = {
    foo: 'bar'
  };
  const handler = (state, action) => {
    return state;
  };

  const spy = sinon.spy(handler);

  const functionalReducer = createReducer(initialState, spy);

  t.true(isFunction(functionalReducer));

  functionalReducer(initialState, {});

  t.true(spy.calledOnce);

  const module = getModules(namespace);

  t.is(module.reducer, functionalReducer);
  t.is(functionalReducer.namespace, namespace);

  const plainObjectReducer = createReducer(initialState, {});

  t.is(module.reducer, plainObjectReducer);
  t.is(plainObjectReducer.namespace, namespace);
});

test('if getModules returns a module if string is passed, else returns all modules', (t) => {
  const namespace = 'foo_get';

  createModule(namespace);

  const individualResult = getModules(namespace);

  t.true(isPlainObject(individualResult));
  t.true(isPlainObject(individualResult.actions));
  t.true(isFunction(individualResult.reducer));

  const allResult = getModules();

  t.true(allResult.hasOwnProperty(namespace));
});
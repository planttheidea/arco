import test from 'ava';

import Immutable from 'immutable';
import isFunction from 'lodash/isFunction';
import {
  browserHistory,
  hashHistory,
  useRouterHistory
} from 'react-router';
import {
  LOCATION_CHANGE
} from 'react-router-redux';
import {
  createStore
} from 'redux';
import {
  combineReducers
} from 'redux-immutable';

import {
  createHistory,
  syncHistoryWithImmutableStore
} from 'src/router';

const HISTORY_OBJECT_KEYS = [
  'getCurrentLocation',
  'listenBefore',
  'listen',
  'transitionTo',
  'push',
  'replace',
  'go',
  'goBack',
  'goForward',
  'createKey',
  'createPath',
  'createHref',
  'createLocation'
];

const isHistoryObject = (t, object, isSynced) => {
  const objectKeys = Object.keys(object);
  const expectedKeys = [
    ...HISTORY_OBJECT_KEYS,
    isSynced ? 'unsubscribe' : 'canGo'
  ];

  return new Promise((resolve) => {
    t.deepEqual(objectKeys, expectedKeys);

    objectKeys.forEach((key) => {
      t.true(isFunction(object[key]), key);
    });

    resolve();
  });
};

test('if createHistory returns the history objects when state histories are used', async (t) => {
  const defaultHistory = createHistory();
  const browser = createHistory('browser');
  const hash = createHistory('hash');

  t.is(defaultHistory, browserHistory);
  t.is(browser, browserHistory);
  t.is(hash, hashHistory);

  const memory = createHistory('memory');

  await isHistoryObject(t, memory);

  const custom = createHistory((useRouterHistoryFn) => {
    return useRouterHistoryFn;
  });

  t.is(custom, useRouterHistory);
});

test('if syncHistoryWithImmutableStore will call syncHistoryWithStore with the correct parameters', async (t) => {
  const history = createHistory();
  const preloadedState = Immutable.Map();

  const initialState = Immutable.fromJS({
    locationBeforeTransitions: null
  });

  const rootReducer = combineReducers({
    routing: (state = initialState, {payload, type}) => {
      if (type === LOCATION_CHANGE) {
        return state.set('locationBeforeTransitions', payload);
      }

      return state;
    }
  });
  const store = createStore(rootReducer, preloadedState);

  const result = syncHistoryWithImmutableStore(history, store);

  await isHistoryObject(t, result, true);
});
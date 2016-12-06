// external dependencies
import Immutable from 'immutable';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import {
  LOCATION_CHANGE,
  routerReducer
} from 'react-router-redux';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as createReduxStore
} from 'redux';
import {
  combineReducers as combineImmutableReducers
} from 'redux-immutable';
import reduxThunk from 'redux-thunk';

// modules
import {
  getModules
} from './state';

// constants
import {
  ARCO_STATE_KEY,
  ERROR_TYPES
} from './constants';

// utils
import {
  testParameter
} from './utils';

const IMMUTABLE_ROUTING_REDUCER_INITIAL_STATE = Immutable.fromJS({
  locationBeforeTransitions: null
});

export const immutableRouterReducer = (state = IMMUTABLE_ROUTING_REDUCER_INITIAL_STATE, {payload, type}) => {
  if (type === LOCATION_CHANGE) {
    return state.set('locationBeforeTransitions', payload);
  }

  return state;
};

/**
 * @module store
 */

/**
 * @private
 *
 * @function addWindowUnloadListener
 *
 * @description
 * add a listener to beforeunload to save the state in sessionStorage
 *
 * @param {Object} store state to store in sessionStorage for retrieval on refresh
 */
export const addWindowUnloadListener = (store) => {
  window.addEventListener('beforeunload', () => {
    const state = store.getState();

    window.sessionStorage.setItem(ARCO_STATE_KEY, JSON.stringify(state));
  });
};

/**
 * @private
 *
 * @function createRestorableStateStore
 *
 * @description
 * create a store that will automatically save and restore the state
 * in session storage
 *
 * @param {function} reducers all reducers to be used in the store creation
 * @param {function} enhancers all enhancers to be used in the store creation
 * @param {Object} initialState state to hydrate the store with on creation
 * @returns {Store}
 */
export const createRestorableStateStore = (reducers, enhancers, initialState) => {
  const stateString = window && window.sessionStorage.getItem(ARCO_STATE_KEY);
  const preloadedState = stateString ? JSON.parse(stateString) : {...initialState};
  const store = createReduxStore(reducers, preloadedState, enhancers);

  if (window) {
    addWindowUnloadListener(store);
  }

  return store;
};

/**
 * @private
 *
 * @function getComposedEnhancers
 *
 * @description
 * get the enhancers used in the store based on the middlewares passed
 * and if thunk is to be included
 *
 * @param {Array<function>} middlewares array of middlewares to be applied to the store
 * @param {boolean} hasThunk whether to use redux-thunk middleware
 * @returns {function|undefined}
 */
export const getComposedEnhancers = (middlewares = [], hasThunk) => {
  let enhancers = [...middlewares];

  if (hasThunk) {
    enhancers.unshift(reduxThunk);
  }

  if (!enhancers.length) {
    return;
  }

  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  return composeEnhancers(applyMiddleware(...enhancers));
};

/**
 * @private
 *
 * @function getReducerMap
 *
 * @description
 * get the map of reducers based on the modules / reducers
 * passed and whether or not to include the routing reducer
 *
 * @param {Array<Object|function>} modules array of modules or reducers to populate the store with
 * @param {boolean} hasHistory whether a history object exists, and therefore should have a router reducer
 * @param {boolean} isImmutable whether store is immutable or not
 * @returns {Object}
 */
export const getReducerMap = (modules, hasHistory, isImmutable) => {
  const moduleMap = modules.reduce((reducers, passedReducer) => {
    const namespace = passedReducer.namespace;
    const module = isFunction(passedReducer) ? passedReducer : getModules(namespace);

    if (!module) {
      return reducers;
    }

    if (isFunction(module)) {
      return {
        ...reducers,
        [namespace]: module
      };
    }

    return {
      ...reducers,
      [namespace]: module.reducer
    };
  }, {});

  if (!hasHistory) {
    return moduleMap;
  }

  const routing = !isImmutable ? routerReducer : immutableRouterReducer;

  return {
    ...moduleMap,
    routing
  };
};

/**
 * @function createStore
 *
 * @description
 * create a store based on the options passed
 *
 * @example
 * import {
 *  createStore
 * } from 'arco';
 *
 * import appModule from 'modules/app';
 * import fooModule from 'modules/foo';
 * import barModule from 'modules/bar';
 *
 * const store = createStore([appModule, fooModule, barModule], {
 *  shouldRestoreState: true
 * });
 *
 * @param {Array<Object|function>} modules array of modules or reducers to use in the store creation
 * @param {boolean} [autoRestore=false] whether the state should be kept in sessionStorage and automatically restored
 * @param {Object} history history object to use for creation of the store
 * @param {Object} [initialState={}] state to hydrate the store with upon creation
 * @param {boolean} [isImmutable=false] whether to use redux-immutable when combining reducers (if using ImmutableJS)
 * @param {Array<Object|function>} [middlewares=[]] array of middlewares to use in the store creation
 * @param {boolean} [thunk=true] whether to include redux-thunk in the middlewares used in the store creation
 * @returns {Store}
 */
export const createStore = (modules, {
  autoRestore = false,
  history,
  initialState = {},
  isImmutable = false,
  middlewares = [],
  thunk = true
} = {}) => {
  testParameter(modules, isArray, 'The first parameter must be an array of modules.', ERROR_TYPES.TYPE);
  testParameter(initialState, isPlainObject, 'initialState must be an object.', ERROR_TYPES.TYPE);
  testParameter(middlewares, isArray, 'middlewares must be an array of functions.', ERROR_TYPES.TYPE);

  const reducerCombiner = isImmutable ? combineImmutableReducers : combineReducers;

  const mapOfReducers = getReducerMap(modules, !!history, isImmutable);
  const allReducers = reducerCombiner(mapOfReducers);
  const enhancers = getComposedEnhancers(middlewares, thunk);

  if (!autoRestore) {
    return createReduxStore(allReducers, initialState, enhancers);
  }

  return createRestorableStateStore(allReducers, enhancers, initialState);
};

export default createStore;

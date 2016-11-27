// external dependencies
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import {
  routerReducer
} from 'react-router-redux';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as createReduxStore
} from 'redux';
import reduxThunk from 'redux-thunk';

// modules
import {
  getModules
} from './state';

// constants
import {
  ARCO_STATE_KEY
} from './constants';

const DEFAULT_REDUCERS_WITH_HISTORY = {
  routing: routerReducer
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
 * @function getEnhancers
 *
 * @description
 * get the enhancers used in the store based on the middlewares passed
 * and if thunk is to be included
 *
 * @param {Array<function>} middlewares array of middlewares to be applied to the store
 * @param {boolean} hasThunk whether to use redux-thunk middleware
 * @returns {function}
 */
export const getEnhancers = (middlewares = [], hasThunk) => {
  let enhancers = [...middlewares];

  if (hasThunk) {
    enhancers.unshift(reduxThunk);
  }

  if (!enhancers.length) {
    return undefined;
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
 * @returns {Object}
 */
export const getReducerMap = (modules, hasHistory) => {
  let moduleMap = hasHistory ? DEFAULT_REDUCERS_WITH_HISTORY : {};

  return modules.reduce((reducers, passedReducer) => {
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
  }, moduleMap);
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
 * @param {Array<Object|function>} [middlewares=[]] array of middlewares to use in the store creation
 * @param {boolean} [thunk=true] whether to include redux-thunk in the middlewares used in the store creation
 * @returns {Store}
 */
export const createStore = (modules, {
  autoRestore = false,
  history,
  initialState = {},
  middlewares = [],
  thunk = true
}) => {
  if (!isArray(modules)) {
    throw new TypeError('The first parameter must be an array of modules.');
  }

  const mapOfReducers = getReducerMap(modules, !!history);
  const allReducers = combineReducers(mapOfReducers);
  const enhancers = getEnhancers(middlewares, thunk);

  if (!autoRestore) {
    return createReduxStore(allReducers, initialState, enhancers);
  }

  return createRestorableStateStore(allReducers, enhancers, initialState);
};

export default createStore;

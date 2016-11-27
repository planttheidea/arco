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
} from './modules';

// constants
import {
  ARCO_STATE_KEY
} from './constants';

const DEFAULT_REDUCERS_WITH_HISTORY = {
  routing: routerReducer
};

/**
 * create a store that will automatically save and restore the state
 * in session storage
 *
 * @param {function} reducers
 * @param {function} enhancers
 * @param {Object} initialState
 * @returns {Store}
 */
export const createRestorableStateStore = (reducers, enhancers, initialState) => {
  const stateString = window && window.sessionStorage.getItem(ARCO_STATE_KEY);
  const preloadedState = stateString ? JSON.parse(stateString) : {...initialState};
  const store = createReduxStore(reducers, preloadedState, enhancers);

  if (window) {
    window.addEventListener('beforeunload', () => {
      const state = store.getState();

      window.sessionStorage.setItem(ARCO_STATE_KEY, JSON.stringify(state));
    });
  }

  return store;
};

/**
 * get the enhancers used in the store based on the middlewares passed
 * and if thunk is to be included
 *
 * @param {Array<function>} middlewares
 * @param {boolean} hasThunk
 * @returns {function}
 */
export const getEnhancers = (middlewares, hasThunk) => {
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
 * get the map of reducers based on the modules / reducers
 * passed and whether or not to include the routing reducer
 *
 * @param {Array<Object|function>} modules
 * @param {boolean} hasHistory
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
 * create a store based on the options passed
 *
 * @param {Array<Object|function>} modules
 * @param {Object} history
 * @param {Object} initialState
 * @param {Array<Object|function>} middlewares
 * @param {boolean} shouldRestoreState
 * @param {boolean} thunk
 * @returns {Store}
 */
export const createStore = (modules, {
  history,
  initialState = {},
  middlewares = [],
  shouldRestoreState = false,
  thunk = true
}) => {
  if (!isArray(modules)) {
    throw new TypeError('The first parameter must be an array of modules.');
  }

  const mapOfReducers = getReducerMap(modules, !!history);
  const allReducers = combineReducers(mapOfReducers);
  const enhancers = getEnhancers(middlewares, thunk);

  if (!shouldRestoreState) {
    return createReduxStore(allReducers, initialState, enhancers);
  }

  return createRestorableStateStore(allReducers, enhancers, initialState);
};

export default createStore;

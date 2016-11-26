// external dependencies
import isArray from 'lodash/isArray';
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

const createStore = (modules, {
  history,
  initialState = {},
  middlewares = [],
  shouldRestoreState = false,
  thunk = true
}) => {
  if (!isArray(modules)) {
    throw new TypeError('The first parameter must be an array of modules.');
  }

  let enhancers = [...middlewares];

  if (thunk) {
    enhancers.unshift(reduxThunk);
  }

  const mapOfReducers = modules.reduce((reducers, {namespace}) => {
    const module = getModules(namespace);

    if (!module) {
      return reducers;
    }

    return {
      ...reducers,
      [namespace]: module.reducer
    };
  }, history ? DEFAULT_REDUCERS_WITH_HISTORY : {});

  const allReducers = combineReducers(mapOfReducers);

  if (enhancers.length) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    enhancers = composeEnhancers(applyMiddleware(...enhancers));
  } else {
    enhancers = undefined;
  }

  if (!shouldRestoreState) {
    return createReduxStore(allReducers, initialState, enhancers);
  }

  const stateString = window && window.sessionStorage.getItem(ARCO_STATE_KEY);
  const preloadedState = stateString ? JSON.parse(stateString) : {...initialState};
  const store = createReduxStore(allReducers, preloadedState, enhancers);

  if (window) {
    window.addEventListener('beforeunload', () => {
      const state = store.getState();

      window.sessionStorage.setItem(ARCO_STATE_KEY, JSON.stringify(state));
    });
  }

  return store;
};

export default createStore;

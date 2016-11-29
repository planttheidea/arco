// external dependencies
import isFunction from 'lodash/isFunction';
import {
  IndexLink,
  IndexRedirect,
  IndexRoute,
  Link,
  Route,
  Router,
  RouterContext,
  applyRouterMiddleware,
  browserHistory,
  createMemoryHistory,
  createRoutes,
  formatPattern,
  hashHistory,
  locationShape,
  match,
  routerShape,
  useRouterHistory,
  withRouter
} from 'react-router';
import {
  syncHistoryWithStore
} from 'react-router-redux';

// utils
import {
  testParameter
} from './utils';

// constants
import {
  ERROR_TYPES,
  HISTORY_TYPES
} from './constants';

/**
 * @module router
 */

/**
 * @function createHistory
 *
 * @description
 * pass the internal react-router pieces necessary to build a custom history
 *
 * @example
 * import createHashHistory from 'history/lib/createHashHistory';
 * import {
 *  createHistory
 * } from 'arco';
 *
 * // create using the string shorthand
 * // valid values are "browser", "hash", "memory"
 * const history = createHistory('browser');
 *
 * // or with a custom function
 * const history = createHistory((useRouterHistory) => {
 *  return useRouterHistory(createHashHistory)({
 *    queryKey: false
 *  });
 * });
 *
 * @param {function|'browser'|'hash'|'memory'} [history=browser] type of history to create
 * @param {Object} [memoryHistoryOptions] options specific to creating a memory history
 * @returns {Object}
 */
export const createHistory = (history = HISTORY_TYPES.BROWSER, memoryHistoryOptions) => {
  if (history === HISTORY_TYPES.BROWSER) {
    return browserHistory;
  }

  if (history === HISTORY_TYPES.HASH) {
    return hashHistory;
  }

  if (history === HISTORY_TYPES.MEMORY) {
    return createMemoryHistory(memoryHistoryOptions);
  }

  if (isFunction(history)) {
    return history(useRouterHistory);
  }

  testParameter(
    history,
    isFunction,
    'History does not match any known values, and you are not attempting to create your own custom history.',
    ERROR_TYPES.REFERENCE
  );
};

export {IndexLink};
export {IndexRedirect};
export {IndexRoute};
export {Link};
export {Route};
export {Router};
export {RouterContext};
export {applyRouterMiddleware};
export {createRoutes};
export {formatPattern};
export {locationShape};
export {match};
export {routerShape};
export {syncHistoryWithStore};
export {withRouter};

export default createHistory;

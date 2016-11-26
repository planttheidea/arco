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

const HISTORY_TYPES = {
  BROWSER: 'browser',
  HASH: 'hash',
  MEMORY: 'memory'
};

/**
 * pass the internal react-router pieces necessary to build a custom history
 *
 * @param {function|string} createHistory
 * @param {Object} memoryHisoryOptions
 * @returns {Object}
 */
const createHistory = (createHistory = HISTORY_TYPES.BROWSER, memoryHisoryOptions) => {
  if (createHistory === HISTORY_TYPES.BROWSER) {
    return browserHistory;
  }

  if (createHistory === HISTORY_TYPES.HASH) {
    return hashHistory;
  }

  if (createHistory === HISTORY_TYPES.MEMORY) {
    return createMemoryHistory(memoryHisoryOptions);
  }

  if (isFunction(createHistory)) {
    return createHistory({
      browserHistory,
      createMemoryHistory,
      formatPattern,
      hashHistory,
      match,
      useRouterHistory
    });
  }

  throw new ReferenceError('History does not match any known values, and you are not attempting to create' +
    'your own custom history.');
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
export {createHistory};
export {formatPattern};
export {locationShape};
export {match};
export {routerShape};
export {syncHistoryWithStore};
export {withRouter};

export default createHistory;

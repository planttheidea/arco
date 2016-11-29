// external dependencies
import isElement from 'lodash/isElement';
import isPlainObject from 'lodash/isPlainObject';
import React, {
  PropTypes
} from 'react';
import {
  findDOMNode,
  render as ReactRender
} from 'react-dom';
import {
  Provider
} from 'react-redux';

// components
import createComponent, {
  StatefulComponent
} from './components';

// modules
import createModule, {
  getActionConstants
} from './state';

// store
import createStore from './store';

// ajax
import ajax, {
  del,
  get,
  head,
  patch,
  post,
  put
} from './ajax';

// router
import {
  IndexLink,
  IndexRedirect,
  IndexRoute,
  Link,
  Route,
  Router,
  RouterContext,
  applyRouterMiddleware,
  createRoutes,
  createHistory,
  formatPattern,
  locationShape,
  match,
  routerShape,
  syncHistoryWithStore,
  withRouter
} from './router.js';

// selectors
import createSelector from './selectors';

// utils
import {
  isReactElement,
  testParameter
} from './utils';

// constants
import {
  ERROR_TYPES
} from './constants';

/**
 * @module index
 */

/**
 * @function render
 *
 * @description
 * render the passed component with the provided store
 *
 * @example
 * import {
 *  render
 * } from 'arco';
 *
 * import App from './App';
 * import store from './store';
 *
 * render((
 *  <App/>
 * ), document.querySelector('#app'), store);
 *
 * @param {ReactElement} component component to render in element
 * @param {HTMLElement} element HTML element to render Component inside of
 * @param {Object} store redux store to pass to all components
 */
export const render = (component, element, store) => {
  testParameter(component, isReactElement, 'Component passed is not a valid React element.', ERROR_TYPES.TYPE);
  testParameter(element, isElement, 'Element passed to render into is not a valid HTML element.', ERROR_TYPES.TYPE);
  testParameter(store, isPlainObject, 'Store passed is not a valid arco store.', ERROR_TYPES.TYPE);

  ReactRender((
    <Provider store={store}>
      {component}
    </Provider>
  ), element);
};

export {StatefulComponent};
export {createComponent};
export {PropTypes};

export {createModule};
export {getActionConstants};

export {createStore};

export {ajax};
export {del};
export {get};
export {head};
export {patch};
export {post};
export {put};

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

export {React};
export {findDOMNode};
export {React as jsx};

export {createSelector};

export default createComponent;

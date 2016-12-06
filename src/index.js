// external dependencies
import isElement from 'lodash/isElement';
import isPlainObject from 'lodash/isPlainObject';
import React, {
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import {
  Provider
} from 'react-redux';

// components
import {
  Component
} from './Component';
import {
  createComponent
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
  syncHistoryWithImmutableStore,
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
 * @private
 *
 * @function getAppContainerDiv
 *
 * @description
 * get the div to render into and inject it into the DOM
 *
 * @returns {Element}
 */
export const getAppContainerDiv = () => {
  const div = document.createElement('div');
  
  div.id = 'app-container';

  document.body.appendChild(div);
  
  return div;
};

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
  
  if (element.tagName.toLowerCase() === 'body') {
    element = getAppContainerDiv();
  }

  ReactDOM.render((
    <Provider store={store}>
      {component}
    </Provider>
  ), element);
};

export {Component};
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
export {syncHistoryWithImmutableStore};
export {syncHistoryWithStore};
export {withRouter};

export {React};

export {createSelector};

export default createComponent;

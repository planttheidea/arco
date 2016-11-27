// external dependencies
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
  createInstance,
  del,
  get,
  head,
  patch,
  post,
  put,
  setDefaults
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
 * @param {React.Component} Component component to render in element
 * @param {HTMLElement} element HTML element to render Component inside of
 * @param {Object} store redux store to pass to all components
 */
export const render = (Component, element, store) => {
  ReactRender((
    <Provider store={store}>
      {Component}
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
export {createInstance};
export {del};
export {get};
export {head};
export {patch};
export {post};
export {put};
export {setDefaults};

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

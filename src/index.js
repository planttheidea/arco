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
} from './modules';

// store
import createStore from './store';

// ajax
import {
  del,
  get,
  head,
  patch,
  post,
  put,
  setAjaxDefaults
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
 * render the passed component with the provided store
 *
 * @param {React.Component} Component
 * @param {HTMLElement} element
 * @param {Object} store
 */
const render = (Component, element, store) => {
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

export {del};
export {get};
export {head};
export {patch};
export {post};
export {put};
export {setAjaxDefaults};

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
export {render};
export {React as jsx};

export {createSelector};

export default createComponent;

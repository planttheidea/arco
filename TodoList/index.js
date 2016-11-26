import {
  IndexRoute,
  Router,
  Route,
  render,
  syncHistoryWithStore
} from '../src';

import App from './App';

// store
import store from './store';

// history
import history from './history';

// routes
import {
  ROUTES
} from './constants/routes';

const div = document.createElement('div');

const syncedHistory = syncHistoryWithStore(history, store);

render((
  <Router history={syncedHistory}>
    <Route
      component={App}
      path="/"
    >
      {ROUTES.map(({component, isIndex, to}, routeIndex) => {
        const key = `route-${routeIndex}`;

        if (isIndex) {
          return (
            <IndexRoute
              component={component}
              key={key}
            />
          );
        }

        return (
          <Route
            component={component}
            key={key}
            path={to}
          />
        );
      })}
    </Route>
  </Router>
), div, store);

document.body.appendChild(div);

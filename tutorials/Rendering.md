Using the included render function is very similar to the one used in `react-dom`, however it accepts the additional parameter of `store`:

```javascript
import {
  render
} from 'arco';

import App from 'components/App';
import store from 'constants/store';

render((
  <App/>
), document.body, store);
```

Internally, the Component is wrapped with the `Provider` in `react-redux` so that the store is automatically available. One additional thing to note is that unlike in standard `react`, `document.body` is a valid HTML element to render to.

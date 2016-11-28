Modules are the encapsulation of a specific piece of state functionality, meaning the `redux` reducer that manages a particular piece of state and the actions that update that reducer.

Creating a module is as simple as calling `createModule` with a namespace:

```javascript
import {
  createModule
} from 'arco';

export default createModule('app');
```

You can have as many modules as you need for your application, as they translate one-to-one to the reducers in your store.

If you are a fan of the `ducks` pattern, you can include your actions and reducer into a single file very easily:

```javascript
import {
  createModule
} from 'arco';

const module = createModule('foo');

const action = module.createAction('SET_BAR');

const INITIAL_STATE = {
  bar: ''
};

const reducer = module.createReducer(INITIAL_STATE, {
  [action](state, {payload}) {
    return {
      ...state,
      bar: payload
    }
  }
});

export default module;
```

For specifics about creating actions and the reducer from the module, consult the [Actions](http://planttheidea.github.io/arco/tutorials-Actions.html) and [Reducers](http://planttheidea.github.io/arco/tutorials-Reducers.html) tutorials.
The store receives an array of either reducers or full modules, and also accepts a number of options to automatically enhance the store. 

* [Options](#options)
    * [autoRestore](#autorestore)
    * [history](#history)
    * [initialState](#initialstate)
    * [middlewares](#middlewares)
    * [thunk](#thunk)

```javascript
import {
  createHistory,
  createStore
} from 'arco';

import appReducer from 'modules/app/appReducer';
import fooModule from 'modules/foo';

// array can either have reducers or full modules
const modules = [
  appReducer,
  fooModule
];

export default createStore(modules, {
  history: createHistory()
});
```

## Options

#### autoRestore

*boolean, defaults to false*

If set to true, will store the complete state in `sessionStorage` on `beforeunload`, and restore from `sessionStorage` on load if it exists.

#### history

*Object*

Accepts the history object generated from `createHistory`, which is explained in more detail in [the History tutorial](http://planttheidea.github.io/arco/tutorial-History.html).

#### initialState

*Object, defaults to {}*

State to apply to the store by default (equivalent to `preloadedState` in `redux`).

#### middlewares

*Array<function>, defaults to []*

Middlewares to apply to the store (equivalent to `enhancers` in `redux`). If `thunk` is set to `true`, then `redux-thunk` will be automatically included.

#### thunk

*boolean, defaults to true*

If set to false, will prevent the addition of `redux-thunk` in the list of middlewares applied to the store.

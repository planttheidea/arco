Like [Actions](http://planttheidea.github.io/acro/tutorial-Actions.html), Reducers are created with the scope of a namespaced module, however there are two ways to create a Reducer.

* [Traditional method](#traditional-method)
* [Shorthand method](#shorthand-method)

#### Traditional method

For those most comfortable with the traditional way to create a reducer, you can use the classic functional method:

```javascript
import {
  createStore
} from 'arco';

import module, {
  setName
} from 'modules/app';

const INITIAL_STATE = {
  name: null
};

export default module.createReducer(INITIAL_STATE, ({payload, type}) => {
  switch (type) {
    case `${setName}`:
      return {
        ...state,
        name: payload
      };
      
    default:
      return state;
  }
});
```

Notice the way you obtain the type matching; importing the function and converting it to a string will return the namespaced type that is dispatched for that action.

#### Shorthand method

A more concise way to manage the actions is the use of the shorthand mapping method based off of `handleActions` in [redux-actions](https://github.com/acdlite/redux-actions).

```javascript
import {
  createStore
} from 'arco';

import module, {
  setName
} from 'modules/app';

const INITIAL_STATE = {
  name: null
};

export default module.createReducer(INITIAL_STATE, {
  [setName](state, {payload}) {
    return {
      ...state,
      payload
    };
  }
});
```

Same result, but far less code to write.


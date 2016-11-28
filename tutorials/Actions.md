Actions are [Flux Standard Actions](https://github.com/acdlite/flux-standard-action) produced with the scoping of the namespace of the module applied. The creation and use of them is based off of [redux-actions](https://github.com/acdlite/redux-actions).

* [Simple synchronomous actions](#simple-synchronous-actions)
* [Synchronomous actions with payload transformation](#synchronous-actions-with-payload-transformation)
* [Passing metadata](#passing-metadata)
* [Asynchronomous actions](#asynchronous-actions)

#### Simple synchronous actions

For a synchronous action that simply passes the parameter passed through as payload, action creation is very easy:

```javascript
import module from 'modules/app';

const action = module.createAction('FOO');
```

#### Synchronous actions with payload transformation

If you want to manipulate the payload prior to dispatch, provide the transformation method as the second parameter:

```javascript
import module from 'modules/app';

const action = module.createAction('FOO', (data) => {
  return {
    data
  };
});
```

#### Passing metadata

If you want to provide additional data that is separate from the payload, pass a third function to the method:

```javascript
import module from 'modules/app';

// undefined second parameter means that the pass-through method from the simple action creation is used for payload
const action = module.createAction('FOO', undefined, (data) => {
  return {
    hasData: !!data
  };
});
```

The `meta` function will receive the same parameters as the `payload` function.

#### Asynchronous actions

Async actions are a little different, in that they basically serve as a creator of three separate actions for the status of the method. Example:

```javascript
import {
  get
} from 'arco';

import module from 'modules/app';

const action = module.createAsyncAction('FOO', (lifecycle, data) => {
  const {
    onError,
    onRequest,
    onSuccess
  } = lifecycle;
  
  // example with redux-thunk
  return async (dispatch) => {
    dispatch(onRequest());
    
    try {
      const response = await get('/foo');
      
      dispatch(onSuccess(response.data));
    } catch (error) {
      dispatch(onError(error));
    }
  };
});
```

Notice the `lifecycle` parameter is injected, which includes the actions to dispatch with the `status` of the call.
* `onRequest` dispatches an action with `meta` set to `{status: 'PENDING'}`
* `onSuccess` dispatches an action with `meta` set to `{status: 'SUCCESS'}`
* `onError` dispatches an action with `meta` set to `{status: 'ERROR'}`

In all three cases, any parameter passed to the action is the `payload`.

# arco

A React+Redux framework to ease the fatigue

#### Installation

```
$ npm i arco --save
```

#### Summary

`arco` is a framework designed to streamline a lot of the architectural configuration of a React application by providing several web-standard packages built-in, as well as an API that is built to keep boilerplate minimal.

The following packages are all included as part of `arco`:
* [react](https://github.com/facebook/react) for views
* [react-dom](https://github.com/facebook/react/tree/master/packages/react-dom) for rendering into the browser
* [react-router](https://github.com/ReactTraining/react-router) for routing
* [react-router-redux](https://github.com/reactjs/react-router-redux) for react-router bindings into redux
* [redux](https://github.com/reactjs/redux) for state management
* [redux-actions](https://github.com/acdlite/redux-actions) for simplified redux action creation
* [redux-thunk](https://github.com/gaearon/redux-thunk) for asynchronous actions (optional)
* [reselect](https://github.com/reactjs/reselect) for memoized selectors

`arco` provides a layer of abstraction over the use of these so that you can focus on implementation, but with the same sort of flexibility you would expect from each of these packages directly. Think of it as convention **with** configuration.

Additionally, keeping in line with `redux`, there is a focus on *immutability* and *pure functions*. Notice in the usage example below that `App` has lifecycle methods and an instance method with access to props even though it is a functional component. This is explained more in detail below.

#### Usage

A full application (with store, actions, and reducer) in 64 lines:

```javascript
import createComponent, {
  createHistory,
  createModule,
  createStore,
  render
} from 'arco';

// create a module
const appModule = createModule('app');

// create actions for that module
const increaseCount = appModule.createAction('INCREASE_COUNT', (currentCount) => {
  return currentCount + 1;
});

// create a reducer for that module
const reducer = appModule.createReducer({count: 0}, {
  [increaseCount](state, {payload}) {
    return {
      ...state,
      count: payload
    };
  }
});

// create your component
const App = ({count, onClickButton}) => {
  return (
    <main>
      <div>
        Current count: {count}
      </div>
      
      <button
        onClick={onClickButton}
        type="button"
      >
        Click to increase the count
      </button>
    </main>
  );
};

// give it options
const ConnectedApp = createComponent(App, {
    mapStateToProps({app}) {
      return app; 
    },
    mapDispatchToProps: {
      increaseCount
    },
    onClickButton(e, {count, increaseCount}) {
      increaseCount(count);
    }
});

// create your store
const store = createStore([appModule], {
  history: createHistory()
});

// render
render((
  <App/>
), document.body, store);
```

The biggest change from what you are used to is probably the options we pass to create `ConnectedApp`. Internally, `arco` creates lifecycle and standard methods where the props and context are passed in as parameters to the method (rather than accessing them through the *this* reference to the instance). This allows you to write your lifecycle and instance methods as pure functions, making them both more testable and free of side effects.

The full range of options is covered on the [documentation site](http://planttheidea.github.io/acro).
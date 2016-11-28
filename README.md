# arco

A React+Redux framework to ease the fatigue

#### Installation

```
$ npm i arco --save
```

#### Summary

`arco` is a framework designed to streamline a lot of the architectural configuration of a React application by providing several web-standard packages built-in, as well as an API that is built to keep boilerplate minimal.

The following packages are all included as part of `arco`:
* [axios](https://github.com/mzabriskie/axios) for AJAX calls
* [react](https://github.com/facebook/react) for views
* [react-dom](https://github.com/facebook/react/tree/master/packages/react-dom) for rendering into the browser
* [react-router](https://github.com/ReactTraining/react-router) for routing
* [react-router-redux](https://github.com/reactjs/react-router-redux) for react-router bindings into redux
* [redux](https://github.com/reactjs/redux) for state management
* [redux-actions](https://github.com/acdlite/redux-actions) for simplified redux action creation
* [redux-thunk](https://github.com/gaearon/redux-thunk) for asynchronous actions (optional)
* [reselect](https://github.com/reactjs/reselect) for memoized selectors

Additionally, the following concepts are applied through convention:
* [ducks](https://github.com/erikras/ducks-modular-redux) for encapsulated functionality modules of actions / reducer
* [flux-standard-action](https://github.com/acdlite/flux-standard-action) for formatting of actions in a standard way

`arco` provides a layer of abstraction over the use of these so that you can focus on implementation, but with the same sort of flexibility you would expect from each of these packages directly. Think of it as convention **with** configuration. Additionally, keeping in line with `redux`, `arco` focuses on *immutability* and *pure functions* to eliminate side effects and make testing easier.

#### Building an app

You can find tutorials on how to create each aspect of an `arco` app in the "Tutorials" section, or select from below:

* [Actions](http://planttheidea.github.io/arco/tutorial-Actions.html): actions consumed by your `redux` store (based on `redux-actions`)
* [Ajax](http://planttheidea.github.io/arco/tutorial-Ajax.html): make async calls, such as to an API (based on `axios`)
* [Components](http://planttheidea.github.io/arco/tutorial-Components.html): `react` components that are connected to your store and enhanced by 
the use of pure functions
* [History](http://planttheidea.github.io/arco/tutorial-History.html): history used with `react-router` for the single-page application
* [Modules](http://planttheidea.github.io/arco/tutorial-Modules.html): encapsulated modules that contain `redux` actions and a reducer to manage
them (based on )
* [Reducers](http://planttheidea.github.io/arco/tutorial-Reducers.html): reducer that contains state of a specific topic in your `redux` store
* [Rendering](http://planttheidea.github.io/arco/tutorial-Rendering.html): rendering your `react` views into the DOM
* [Router](http://planttheidea.github.io/arco/tutorial-Router.html): render your `react` views active in the route (based on `react-router`)
* [Selectors](http://planttheidea.github.io/arco/tutorial-Selectors.html): memoized selectors for computed data to keep your stored state small (based on `reselect`)
* [Store](http://planttheidea.github.io/arco/tutorial-Store.html): your `redux` store which encompasses the state of your entire application

#### Contributing

This project is in its infancy, and many more expansion capabilities are there:
* Universal app setup
* Predefined webpack / ESLint / Babel config
* CLI interface to automate creation of app scaffold

I welcome [any and all ideas](https://github.com/planttheidea/arco/issues), but especially PRs.

#### Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:
* `build` => run webpack to build crio.js with NODE_ENV=development
* `build:minifed` => run webpack to build crio.min.js with NODE_ENV=production
* `dev` => run webpack dev server to run example app (playground!)
* `dist` => runs `build` and `build-minified`
* `docs` => builds the docs via `jsdoc`
* `lint` => run ESLint against all files in the `src` folder
* `prepublish` => runs `compile-for-publish`
* `prepublish:compile` => run `lint`, `test`, `transpile`, `dist`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:watch` => same as `test`, but runs persistent watcher
* `transpile` => run babel against all files in `src` to create files in `lib`

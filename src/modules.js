// external dependencies
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import {
  createAction as createReduxAction,
  handleActions
} from 'redux-actions';

let moduleCache = {};

const createModule = (namespace) => {
  if (!isString(namespace)) {
    throw new TypeError('Namespace provided must be a string.');
  }

  if (moduleCache[namespace]) {
    throw new ReferenceError(`Namespace ${namespace} is already in use.`);
  }

  moduleCache[namespace] = {
    actions: {},
    reducer: noop
  };

  const createAction = (name, payloadCreator, metaCreator) => {
    if (!isString(name)) {
      throw new TypeError('Name of action must be a string.');
    }

    const constantName = `${namespace}/${name}`;
    const action = createReduxAction(constantName, payloadCreator, metaCreator);

    moduleCache[namespace].actions[name] = {
      action,
      constantName
    };

    return action;
  };

  const createAsyncAction = (name, handler) => {
    if (!isString(name)) {
      throw new TypeError('Name of action must be a string.');
    }

    const onRequest = createAction(`${name}_REQUEST`);
    const onError = createAction(`${name}_ERROR`);
    const onSuccess = createAction(`${name}_SUCCESS`);

    const lifecycle = {
      onError,
      onRequest,
      onSuccess
    };

    const action = (...args) => {
      return handler(lifecycle, ...args);
    };

    action.onRequest = onRequest;
    action.onError = onError;
    action.onSuccess = onSuccess;

    return action;
  };

  const createReducer = (initialState, handler) => {
    const reducer = !isFunction(handler)
      ? handleActions(handler, initialState)
      : (state = initialState, action) => {
      return handler(state, action);
    };

    moduleCache[namespace].reducer = reducer;

    return reducer;
  };

  return {
    createAction,
    createAsyncAction,
    createReducer,
    namespace
  };
};

const getModules = (namespace) => {
  if (isString(namespace)) {
    return moduleCache[namespace];
  }

  return moduleCache;
};

const getActionConstants = (namespace) => {
  const module = moduleCache[namespace];

  if (!module) {
    return {};
  }

  return Object.keys(module.actions).reduce((constants, key) => {
    return {
      ...constants,
      [key]: module.actions[key].constantName
    };
  }, {});
};

export {createModule};
export {getActionConstants};
export {getModules};

export default createModule;

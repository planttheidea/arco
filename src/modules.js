// external dependencies
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import noop from 'lodash/noop';
import {
  createAction as createReduxAction,
  handleActions
} from 'redux-actions';

// constants
import {
  STATUS
} from './constants';

let moduleCache = {};

/**
 * create the action creator that will handle scenarios
 * where data is optionally passed
 *
 * @param {string} status
 * @returns {function(data: *): Object}
 */
const createOptionalDataActionCreator = (status) => {
  return (data) => {
    const payload = {
      status
    };

    if (!isUndefined(data)) {
      return {
        ...payload,
        data
      };
    }

    return payload;
  };
};

/**
 * create action that will dispatch with the error and status
 *
 * @param {Error} error
 * @returns {{error: Error, status: string}}
 */
const asyncErrorActionCreator = (error) => {
  return {
    error,
    status: STATUS.ERROR
  };
};

/**
 * create action that will dispatch with the status and optional data
 *
 * @param {*} data
 * @returns {Object}
 */
const asyncRequestActionCreator = createOptionalDataActionCreator(STATUS.PENDING);

/**
 * create action that will dispatch with status and data passed
 *
 * @param data
 * @returns {{data: *, status: string}}
 */
const asyncSuccessActionCreator = createOptionalDataActionCreator(STATUS.SUCCESS);

/**
 * create a module which has actions and a reducer, and has create methods for them
 *
 * @param {string} namespace
 * @returns {Object}
 */
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

    const onError = createAction(name, asyncErrorActionCreator);
    const onRequest = createAction(name, asyncRequestActionCreator);
    const onSuccess = createAction(name, asyncSuccessActionCreator);

    const lifecycle = {
      onError,
      onRequest,
      onSuccess
    };

    const action = (...args) => {
      return handler(lifecycle, ...args);
    };

    action.onError = onError;
    action.onRequest = onRequest;
    action.onSuccess = onSuccess;

    /**
     * set the toString to return the name passed, so it will work
     * with createReducer
     *
     * @returns {string}
     */
    action.toString = () => {
      return name;
    };

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

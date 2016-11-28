// external dependencies
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import {
  createAction as createReduxAction,
  handleActions
} from 'redux-actions';

// selectors
import {
  getIdentityValue
} from './selectors';

// constants
import {
  STATUS
} from './constants';

let moduleCache = {};

/**
 * @module state
 */

/**
 * @private
 *
 * @function asyncErrorActionCreator
 *
 * @description
 * create action that will dispatch with the error status as meta
 *
 * @returns {{status: string}}
 */
export const asyncErrorActionCreator = () => {
  return {
    status: STATUS.ERROR
  };
};

/**
 * @private
 *
 * @function asyncRequestActionCreator
 *
 * @description
 * create action that will dispatch with the pending status as meta
 *
 * @returns {{status: string}}
 */
export const asyncRequestActionCreator = () => {
  return {
    status: STATUS.PENDING
  };
};

/**
 * @private
 *
 * @function asyncSuccessActionCreator
 *
 * @description
 * create action that will dispatch with the success status as meta
 *
 * @returns {{status: string}}
 */
export const asyncSuccessActionCreator = () => {
  return {
    status: STATUS.SUCCESS
  };
};

/**
 * @private
 *
 * @function getCreateAction
 *
 * @description
 * get the create action creator for a given namespace
 *
 * @param {string} namespace namespace action will reside in
 * @returns {function}
 */
export const getCreateAction = (namespace) => {
  /**
   * @function createAction
   *
   * @description
   * action creator helper that will return the redux-actions
   * action build based on its parameters
   *
   * @example
   * import {
   *  createModule
   * } from 'arco';
   *
   * const module = createModule('foo');
   *
   * const action = module.createAction('SET_NAME');
   *
   * @param {string} name name of the action
   * @param {function} [payloadCreator=getIdentityValue] method to handle the passing of the payload
   * @param {function|null} [metaCreator=null] method to handle any additional metadata
   * @returns {function}
   */
  return (name, payloadCreator = getIdentityValue, metaCreator = null) => {
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
};

/**
 * @private
 *
 * @function getCreateAsyncAction
 *
 * @description
 * get the create async action creator for a given namespace
 *
 * @param {string} namespace namespace action will reside in
 * @returns {function}
 */
const getCreateAsyncAction = (namespace) => {
  const createAction = getCreateAction(namespace);

  /**
   * @function createAsyncAction
   *
   * @description
   * async action creator helper that creates a distinct action for each
   * status with the status passed via payload, and injects the functions
   * for each
   *
   * @example
   * import {
   *  createModule,
   *  get
   * } from 'arco';
   *
   * const module = createModule('foo');
   *
   * const action = module.createAsyncAction('GET_STUFF', (lifecycle, otherData) => {
   *  const {
   *    onError,
   *    onRequest,
   *    onSuccess
   *  } = lifecycle;
   *
   *  return (dispatch) => {
   *    dispatch(onRequest(otherData));
   *    // otherData is passed as payload, PENDING is passed as status in meta
   *
   *    return get('/foo')
   *      .then((data) => {
   *        dispatch(onSuccess(data));
   *        // data is passed as payload, SUCCESS is passed as status in meta
   *      })
   *      .catch((error) => {
   *        dispatch(onError(error));
   *        // error is passed as payload, ERROR is passed as status in meta
   *      });
   *  };
   * });
   *
   * @param {string} name name of the action
   * @param {function} payloadHandler method to handle the passing of the payload
   * @returns {function}
   */
  return (name, payloadHandler) => {
    if (!isString(name)) {
      throw new TypeError('Name of action must be a string.');
    }

    const onError = createAction(name, getIdentityValue, asyncErrorActionCreator);
    const onRequest = createAction(name, getIdentityValue, asyncRequestActionCreator);
    const onSuccess = createAction(name, getIdentityValue, asyncSuccessActionCreator);

    const lifecycle = {
      onError,
      onRequest,
      onSuccess
    };

    const action = (...args) => {
      return payloadHandler(lifecycle, ...args);
    };

    //in case you want different handlers in the reducer for each action status
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
};

/**
 * @private
 *
 * @function getCreateReducer
 *
 * @description
 * get the reducer creator for a given namespace
 *
 * @param {string} namespace namespace reducer will reside in
 * @returns {function}
 */
const getCreateReducer = (namespace) => {
  /**
   * @function createReducer
   *
   * @description
   * reducer creator that will accept the initialState and the handler of that
   * function, either as standard function or as redux-actions map
   *
   * @example
   * import {
   *  getActionConstants
   * } from 'arco';
   *
   * import module, {
   *  setName
   * } from './actions';
   *
   * const INITIAL_STATE = {
   *  name: ''
   * };
   *
   * // use the handleActions method from redux-actions
   * module.createReducer(INITIAL_STATE, (state, {
   *  [setName](state, {payload}) {
   *    return {
   *      ...state,
   *      name: payload
 *      };
   *  }
   * });
   *
   * // or use the traditional reducer function method, which requires converting the actions toString
   * module.createReducer(INITIAL_STATE, (state, {payload, type}) => {
   *  switch (type) {
   *    case `${setName}`:
   *      return {
   *        ...state,
   *        name: payload
   *      };
   *
 *      default:
 *        return state;
   *  }
   * });
   *
   * @param {Object} initialState initial state to hydrate store with
   * @param {function} handler method to handle state updates
   * @returns {function}
   */
  return (initialState, handler) => {
    const reducer = !isFunction(handler)
      ? handleActions(handler, initialState)
      : (state = initialState, action) => {
      return handler(state, action);
    };

    moduleCache[namespace].reducer = reducer;
    reducer.namespace = namespace;

    return reducer;
  };
};

/**
 * @function createModule
 *
 * @description
 * create a module which has actions and a reducer, and has create methods for them
 *
 * @example
 * import {
 *  createModule
 * } from 'arco';
 *
 * const appModule = createModule('app');
 *
 * @param {string} namespace namespace for the module
 * @returns {Object}
 */
export const createModule = (namespace) => {
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

  const createAction = getCreateAction(namespace);
  const createAsyncAction = getCreateAsyncAction();
  const createReducer = getCreateReducer(namespace);

  return {
    createAction,
    createAsyncAction,
    createReducer,
    namespace
  };
};

/**
 * @function getModules
 *
 * @description
 * get the module for the given namespace, or all modules if none
 *
 * @example
 * import {
 *  getModules
 * } from 'arco';
 *
 * const allModules = getModules();
 * const appModule = getModules('app');
 *
 * @param {string} namespace namespace of module to retrieve
 * @returns {Object}
 */
export const getModules = (namespace) => {
  if (isString(namespace)) {
    return moduleCache[namespace];
  }

  return moduleCache;
};

export default createModule;

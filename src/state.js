// external dependencies
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import {
  createAction as createReduxAction,
  handleActions,
} from 'redux-actions';

// selectors
import {getIdentityValue} from './selectors';

// constants
import {
  ERROR_TYPES,
  STATUS,
} from './constants';

// utils
import {
  testMetaHandler,
  testParameter,
  testReducerHandler,
} from './utils';

let moduleCache = {};

/**
 * @module state
 */

/**
 * @private
 *
 * @function asyncActionStatusCreator
 *
 * @description
 * create action that will dispatch with the error status as meta
 *
 * @param {string} status status to provide for the action
 * @returns {function(): {status: string}}
 */
export const asyncActionStatusCreator = (status) => () => ({
  status,
});

/**
 * @private
 *
 * @function createNamespacedName
 *
 * @description
 * create the namespaced version of the action name
 *
 * @param {string} namespace namespace of the module
 * @param {string} name name of the action
 * @returns {string}
 */
export const createNamespacedName = (namespace, name) => `${namespace}/${name}`;

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
export const getCreateAction = (namespace) =>
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
  (name, payloadCreator = getIdentityValue, metaCreator = null) => {
    testParameter(name, isString, 'Name of action must be a string.', ERROR_TYPES.TYPE);
    testParameter(payloadCreator, isFunction, 'Payload handler must be a function.', ERROR_TYPES.TYPE);
    testParameter(payloadCreator, isFunction, 'Payload handler must be a function.', ERROR_TYPES.TYPE);
    testParameter(metaCreator, testMetaHandler, 'meta handler must be a function.', ERROR_TYPES.TYPE);

    const constantName = createNamespacedName(namespace, name);
    const action = createReduxAction(constantName, payloadCreator, metaCreator);

    moduleCache[namespace].actions[name] = {
      action,
      constantName,
    };

    return action;
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
export const getCreateAsyncAction = (namespace) => {
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
    testParameter(name, isString, 'Name of action must be a string.', ERROR_TYPES.TYPE);
    testParameter(payloadHandler, isFunction, 'Payload handler must be a function.', ERROR_TYPES.TYPE);

    const onError = createAction(name, getIdentityValue, asyncActionStatusCreator(STATUS.ERROR));
    const onRequest = createAction(name, getIdentityValue, asyncActionStatusCreator(STATUS.PENDING));
    const onSuccess = createAction(name, getIdentityValue, asyncActionStatusCreator(STATUS.SUCCESS));

    const lifecycle = {
      onError,
      onRequest,
      onSuccess,
    };

    const action = (...args) => payloadHandler(lifecycle, ...args);

    //in case you want different handlers in the reducer for each action status
    action.onError = onError;
    action.onRequest = onRequest;
    action.onSuccess = onSuccess;

    const actionName = createNamespacedName(namespace, name);

    /**
     * set the toString to return the name passed, so it will work
     * with createReducer
     *
     * @returns {string}
     */
    action.toString = () => actionName;

    moduleCache[namespace].actions[name].action = action;

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
export const getCreateReducer = (namespace) =>
  /**
   * @function createReducer
   *
   * @description
   * reducer creator that will accept the initialState and the handler of that
   * function, either as standard function or as redux-actions map
   *
   * @example
   * import {
   *  getCreateReducer
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
   * const createReducer = getCreateReducer('namespace');
   *
   * // use the handleActions method from redux-actions
   * createReducer(INITIAL_STATE, (state, {
   *  [setName](state, {payload}) {
   *    return {
   *      ...state,
   *      name: payload
   *    };
   *  }
   * });
   *
   * // or use the traditional reducer function method, which requires converting the actions toString
   * createReducer(INITIAL_STATE, (state, {payload, type}) => {
   *  switch (type) {
   *    case `${setName}`:
   *      return {
   *        ...state,
   *        name: payload
   *      };
   *
   *    default:
   *      return state;
   *  }
   * });
   *
   * @param {Object} initialState initial state to hydrate store with
   * @param {function} handler method to handle state updates
   * @returns {function}
   */
  (initialState, handler) => {
    let reducer;

    testParameter(handler, testReducerHandler, 'Reducer must either be an object or a function.', ERROR_TYPES.TYPE);

    if (isFunction(handler)) {
      reducer = (state = initialState, action) => handler(state, action);
    } else if (isPlainObject(handler)) {
      reducer = handleActions(handler, initialState);
    }

    moduleCache[namespace].reducer = reducer;
    reducer.namespace = namespace;

    return reducer;
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
  testParameter(namespace, isString, 'Namespace provided must be a string.', ERROR_TYPES.TYPE);

  if (moduleCache[namespace]) {
    throw new ReferenceError(`Namespace ${namespace} is already in use.`, ERROR_TYPES.REFERENCE);
  }

  moduleCache[namespace] = {
    actions: {},
    reducer: noop,
  };

  const createAction = getCreateAction(namespace);
  const createAsyncAction = getCreateAsyncAction();
  const createReducer = getCreateReducer(namespace);

  return {
    createAction,
    createAsyncAction,
    createReducer,
    namespace,
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

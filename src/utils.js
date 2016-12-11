// external dependencies
import moize from 'moize';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import noop from 'lodash/noop';
import {
  Component
} from 'react';

// constants
import {
  ERROR_TYPES,
  REACT_ELEMENT_TYPE,
  REACT_LIFECYCLE_METHODS,

  keys
} from './constants';

/* eslint-disable no-console */
if (!console.error) {
  console.error = console.log || noop;
}
/* eslint-enable */

/**
 * @private
 *
 * @function testParameter
 *
 * @description
 * if the object is the type based on testMethod, fire error with
 * message and type
 *
 * @param {*} object object to be tested
 * @param {function} testMethod method to test the type of object
 * @param {string} message message to show in error if not of proper type
 * @param {'Error'|'ReferenceError'|'TypeError'} [type='Error'] type of error to show
 */
export const testParameter = (object, testMethod, message, type = ERROR_TYPES.DEFAULT) => {
  if (!testMethod(object)) {
    /* eslint-disable no-console */
    console.error(`${type}: ${message}`);
    /* eslint-enable */
  }
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * get the methods that will be added to the component
 *
 * @param {Object} options options passed to arco when generating the component
 * @returns {{lifecycleMethods: Object, localMethods: Object}}
 */
export const getComponentMethods = (options) => {
  let lifecycleMethods = {},
      localMethods = {};

  keys(options).forEach((method) => {
    if (REACT_LIFECYCLE_METHODS[method]) {
      lifecycleMethods[method] = options[method];
    } else {
      testParameter(options[method], isFunction, `${method} is not a function, skipping assignment to instance.`,
        ERROR_TYPES.TYPE);

      if (isFunction(options[method])) {
        localMethods[method] = options[method];
      }
    }
  });

  return {
    lifecycleMethods,
    localMethods
  };
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * get the flattened object with both props and methods
 *
 * @param {Object} props native props of the component
 * @param {Object} methods instance methods to pass down as props
 * @returns {Object}
 */
export const getPropsAndMethods = (props, methods) => {
  return {
    ...props,
    ...methods
  };
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * is the object an extension of the Component prototype
 *
 * @param {*} object object to test
 * @returns {boolean}
 */
export const isReactClass = (object) => {
  return Component.isPrototypeOf(object);
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * is the object a composite component wrapper for React
 * 
 * @param {*} object object to test
 * @returns {boolean}
 */
export const isReactCompositeComponentWrapper = (object) => {
  return !!(object && object._instance && object._instance.props);
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * is the object a React element
 *
 * @param {ReactElement} object object to test
 * @returns {boolean}
 */
export const isReactElement = (object) => {
  return !!object && object.$$typeof === REACT_ELEMENT_TYPE;
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * is the object passed an event
 *
 * @param {*} object object to test
 * @returns {boolean}
 */
export const isReactEvent = (object) => {
  return !!(object && object.nativeEvent && object.nativeEvent instanceof Event);
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * serialize the values for memoization
 *
 * @returns {string}
 */
export const memoizeSerializer = function() {
  return JSON.stringify(arguments, (name, value) => {
    if (isFunction(value)) {
      return `${value}`;
    }

    if (isReactElement(value)) {
      return value.props;
    }

    if (isReactCompositeComponentWrapper(value)) {
      return value._instance.props;
    }

    return value;
  });
};

/**
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * use fast-memoize with a custom serializer to handle memoizing functions
 *
 * @param {function} fn method to memoize
 * @returns {function}
 */
export const memoize = (fn) => {
  return moize(fn, {
    serializer: memoizeSerializer
  });
};

/**
 * @private
 *
 * @function testMetaHandler
 *
 * @description
 * test if the meta handler is the correct type
 *
 * @param {function} metaHandler the method used to handle meta properties in atcion creation
 * @returns {boolean}
 */
export const testMetaHandler = (metaHandler) => {
  return !metaHandler || isFunction(metaHandler);
};


/**
 * @private
 *
 * @function testReducerHandler
 *
 * @description
 * test if the reducer is the correct type
 *
 * @param {function} handler the method used as reducer for a module
 * @returns {boolean}
 */
export const testReducerHandler = (handler) => {
  return isFunction(handler) || isPlainObject(handler);
};

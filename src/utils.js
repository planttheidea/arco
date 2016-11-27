// external dependencies
import fastMemoize from 'fast-memoize';
import isFunction from 'lodash/isFunction';
import {
  Component
} from 'react';

// constants
import {
  REACT_ELEMENT_TYPE,
  REACT_LIFECYCLE_METHODS,

  keys
} from './constants';

/**
 * get the methods that will be added to the component
 *
 * @param {Object} options
 * @returns {{lifecycleMethods: Object, localMethods: Object}}
 */
export const getComponentMethods = (options) => {
  let lifecycleMethods = {},
    localMethods = {};

  keys(options).forEach((method) => {
    if (REACT_LIFECYCLE_METHODS[method]) {
      lifecycleMethods[method] = options[method];
    } else if (isFunction(options[method])) {
      localMethods[method] = options[method];
    }
  });

  return {
    lifecycleMethods,
    localMethods
  };
};

/**
 * recursively get the nested value from the the object
 * based on the array of properties passed
 *
 * @param {Object} object
 * @param {Array<string>} properties
 * @returns {*}
 */
export const getNestedValueFromObject = (object, properties) => {
  const [
    property,
    ...restOfProperties
  ] = properties;

  if (!object.hasOwnProperty(property)) {
    return undefined;
  }

  if (!restOfProperties.length) {
    return object[property];
  }

  return getNestedValueFromObject(object[property], restOfProperties);
};

/**
 * get the flattened object with both props and methods
 *
 * @param {Object} props
 * @param {Object} methods
 * @returns {Object}
 */
export const getPropsAndMethods = (props, methods) => {
  return {
    ...props,
    ...methods
  };
};

/**
 * is the object an extension of the Component prototype
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isReactClass = (object) => {
  return Component.isPrototypeOf(object);
};

/**
 * is the object a composite component wrapper for React
 * 
 * @param {*} object
 * @returns {boolean}
 */
export const isReactCompositeComponentWrapper = (object) => {
  return !!(object && object._instance && object._instance.props);
};

/**
 * is the object a React element
 *
 * @param {ReactElement} object
 * @returns {boolean}
 */
export const isReactElement = (object) => {
  return !!object && object.$$type === REACT_ELEMENT_TYPE;
};

/**
 * is the object passed an event
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isReactEvent = (object) => {
  return !!(object && object.nativeEvent && object.nativeEvent instanceof Event);
};

/**
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
 * use fast-memoize with a custom serializer to handle memoizing functions
 *
 * @param {function} fn
 * @returns {function}
 */
export const memoize = (fn) => {
  return fastMemoize(fn, {
    serializer: memoizeSerializer
  });
};

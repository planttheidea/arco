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
 * @private
 *
 * @function getComponentMethods
 *
 * @description
 * recursively get the nested value from the the object
 * based on the array of properties passed
 *
 * @param {Object} object object to retrieve nested value from
 * @param {Array<string>} properties array of property values to move down the tree
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
  return !!object && object.$$type === REACT_ELEMENT_TYPE;
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
  return fastMemoize(fn, {
    serializer: memoizeSerializer
  });
};

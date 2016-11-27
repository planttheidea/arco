// external dependencies
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import toPath from 'lodash/toPath';
import {
  createSelector as createReselectSelector,
  createSelectorCreator
} from 'reselect';

// utils
import {
  getNestedValueFromObject
} from './utils';

/**
 * create selector to retrieve identity based on deeply-nested values
 *
 * @param {function|string} property
 * @returns {function(Object): *}
 */
export const createIdentitySelector = (property) => {
  if (isFunction(property)) {
    return property;
  }

  const pathProperties = toPath(property);

  return (passedState) => {
    return getNestedValueFromObject(passedState, pathProperties);
  };
};

/**
 * pass-through function to return the value passed to it
 *
 * @param {*} value
 * @returns {*}
 */
export const getIdentityValue = (value) => {
  return value;
};

/**
 * build a structured value to return for structured selectors
 *
 * @param {Array<string>} keys
 * @returns {function(Array<*>): Object}
 */
export const getStructuredValue = (keys) => {
  return (...values) => {
    return keys.reduce((structuredValue, key, keyIndex) => {
      structuredValue[key] = values[keyIndex];

      return structuredValue;
    }, {});
  };
};

/**
 * get the standard selector type (single value)
 *
 * @param {Array<string>} paths
 * @param {function} selectorGenerator
 * @param {function} getValue
 * @returns {function}
 */
export const getStandardSelector = (paths, selectorGenerator, getValue) => {
  const selectors = paths.map(createIdentitySelector);

  return selectorGenerator(selectors, getValue);
};

/* eslint-disable valid-jsdoc */
/**
 * get the structured selector based on the properties passed
 *
 * @param {Array<string>} keys
 * @param {Array<string>} paths
 * @param {function} selectorGenerator
 * @returns {function}
 */
/* eslint-enable */
export const getStructuredSelector = ({keys, paths}, selectorGenerator) => {
  if (keys.length !== paths.length) {
    throw new ReferenceError('Keys and properties arrays must be the same length.');
  }

  const selectors = paths.map(createIdentitySelector);

  return selectorGenerator(selectors, getStructuredValue(keys));
};

/**
 * based on the array of properties and the reducer passed
 * create a selector
 * 
 * @param {Array<string>|{keys: Array<string>, paths: Array<string>}} properties
 * @param {function} getComputedValue
 * @param {function} customMemoize
 * @param {function} customMemoizeOptions
 * @returns {function}
 */
export const createSelector = (
  properties = [],
  getComputedValue = getIdentityValue,
  customMemoize = null,
  customMemoizeOptions = null
) => {
  const selectorGenerator = isFunction(customMemoize)
    ? createSelectorCreator(customMemoize, ...customMemoizeOptions)
    : createReselectSelector;

  if (isPlainObject(properties)) {
    return getStructuredSelector(properties, selectorGenerator);
  }

  if (!isArray(properties)) {
    throw new TypeError('Properties passed must be either an object of keys and paths or an array of paths.');
  }

  return getStandardSelector(properties, selectorGenerator, getComputedValue);
};

export default createSelector;

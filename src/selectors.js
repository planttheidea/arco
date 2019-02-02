// external dependencies
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import {
  createSelector as createReselectSelector,
  createSelectorCreator,
} from 'reselect';

// utils
import {testParameter} from './utils';

// constants
import {ERROR_TYPES} from './constants';

/**
 * @module selectors
 */

/**
 * @private
 *
 * @function createIdentitySelector
 *
 * @description
 * create selector to retrieve identity based on deeply-nested values
 *
 * @param {function|string} property property string to convert to nested path
 * @returns {function(Object): *}
 */
export const createIdentitySelector = (property) => {
  if (isFunction(property)) {
    return property;
  }

  return (passedState) => get(passedState, property);
};

/**
 * @private
 *
 * @function getIdentityValue
 *
 * @description
 * pass-through function to return the value passed to it
 *
 * @param {*} value value to pass through
 * @returns {*}
 */
export const getIdentityValue = (value) => value;

/**
 * @private
 *
 * @function getSelectorGenerator
 *
 * @description
 * get the generator for the selector based on the customMemozer being a function or not
 *
 * @param {function} customMemoizer memoizer function to use instead of the default
 * @param {Object} options additional options to use when creating the selector generator
 * @returns {function}
 */
export const getSelectorGenerator = (customMemoizer, options) =>
  isFunction(customMemoizer) ? createSelectorCreator(customMemoizer, ...options) : createReselectSelector;

/**
 * @private
 *
 * @function getStructuredValue
 *
 * @description
 * build a structured value to return for structured selectors
 *
 * @param {Array<string>} keys array of keys to use for values in structured selector
 * @returns {function(Array<*>): Object}
 */
export const getStructuredValue = (keys) => (...values) =>
  keys.reduce((structuredValue, key, keyIndex) => {
    structuredValue[key] = values[keyIndex];

    return structuredValue;
  }, {});

/**
 * @private
 *
 * @function getStandardSelector
 *
 * @description
 * get the standard selector type (single value)
 *
 * @param {Array<string>} paths array of strings denoting nested paths of values in state
 * @param {function} selectorGenerator method to use for generating selector
 * @param {function} getValue method to use for computing the value to return
 * @returns {function}
 */
export const getStandardSelector = (paths, selectorGenerator, getValue) => {
  const selectors = paths.map(createIdentitySelector);

  return selectorGenerator(selectors, getValue);
};

/* eslint-disable valid-jsdoc */
/**
 * @private
 *
 * @function getStructuredSelector
 *
 * @description
 * get the structured selector based on the properties passed
 *
 * @param {Array<string>} keys array of keys to use for values in structured selector
 * @param {Array<string>} paths array of strings denoting nested paths to use for values in structured selector
 * @param {function} selectorGenerator method to use for generating selector
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
 * @function createSelector
 *
 * @description
 * based on the array of properties and the reducer passed
 * create a selector
 *
 * @example
 * import {
 *  createSelector
 * } from 'arco';
 *
 * const hasBaz = createSelector(['foo.bar[0].baz'], (baz) => {
 *  return !!baz;
 * });
 *
 * hasBaz({foo: {bar: [{ baz: 'Here!'}]}}); // true
 * hasBaz({foo: {bar: [{ baz: 'Here!'}]}}); // true, pulled from cache
 *
 * @param {Array<string>|{keys: Array<string>, paths: Array<string>}} properties properties to retrieve from state
 * @param {function} [getComputedValue=getIdentityValue] method for getting the computed value from the properties
 * @param {function} [customMemoizer=null] custom memoizer function to use in place of the default
 * @param {Object} [customMemoizerOptions={}] additional options for using the custom memoizer option
 * @returns {function}
 */
export const createSelector = (
  properties = [],
  getComputedValue = getIdentityValue,
  customMemoizer = null,
  customMemoizerOptions = {}
) => {
  const selectorGenerator = getSelectorGenerator(customMemoizer, customMemoizerOptions);

  if (isPlainObject(properties)) {
    return getStructuredSelector(properties, selectorGenerator);
  }

  testParameter(
    properties,
    isArray,
    'Properties passed must be either an object of keys and paths or an array of paths.',
    ERROR_TYPES.TYPE
  );
  testParameter(getComputedValue, isFunction, 'Computed value passed must be a function.', ERROR_TYPES.TYPE);

  return getStandardSelector(properties, selectorGenerator, getComputedValue);
};

export default createSelector;

// external dependencies
import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';

/**
 * @module ajax
 */

/**
 * @function createInstance
 *
 * @description
 * create a unique axios instance based on the options passed
 *
 * @example
 * import {
 *  createInstance
 * } from 'arco';
 *
 * const ajaxInstance = createInstance({
 *  baseURL: 'http://foo.com'
 * });
 *
 * @param {Object} [options] axios options to pass to the instance when created
 * @returns {AxiosInstance}
 */
export const createInstance = (options = {}) => {
  return axios.create(options);
};

/* eslint-disable valid-jsdoc */
/**
 * @function setDefaults
 *
 * @description
 * set the defaults for the axios instance
 *
 * @example
 * import {
 *  setDefaults
 * } from 'arco';
 *
 * setDefaults({
 *  baseURL: 'http://foo.com',
 *  headers: {
 *    'X-API-Key': 'bar'
 *  }
 * });
 *
 * @param {Object} [options={}]
 * @param {string} [options.baseURL] base URL for all axios calls
 * @param {Object} [options.headers] headers to add to all axios calls
 * @returns {Axios}
 */
/* eslint-enable */
export const setDefaults = ({baseURL, headers} = {}) => {
  if (baseURL) {
    axios.defaults.baseURL = baseURL;
  }

  if (isPlainObject(headers)) {
    const currentHeaders = axios.defaults.headers;
    const {
      common,
      del,
      get,
      head,
      patch,
      post,
      put
    } = headers;

    axios.defaults.headers.common = {
      ...currentHeaders.common,
      ...common
    };
    axios.defaults.headers.delete = {
      ...currentHeaders.delete,
      ...del
    };
    axios.defaults.headers.get = {
      ...currentHeaders.get,
      ...get
    };
    axios.defaults.headers.head = {
      ...currentHeaders.head,
      ...head
    };
    axios.defaults.headers.patch = {
      ...currentHeaders.patch,
      ...patch
    };
    axios.defaults.headers.post = {
      ...currentHeaders.post,
      ...post
    };
    axios.defaults.headers.put = {
      ...currentHeaders.put,
      ...put
    };
  }

  return axios;
};

/**
 * @function del
 *
 * @description
 * perform DELETE call via AJAX
 *
 * @example
 * import {
 *  del
 * } from 'arco';
 *
 * const response = del('/foo/1234');
 *
 * @param {string} url URL to submit DELETE to
 * @param {Object} [config] custom configuration options for specific call
 * @returns {Promise}
 */
export const del = axios.delete;

/**
 * @function get
 *
 * @description
 * perform GET call via AJAX
 *
 * @example
 * import {
 *  get
 * } from 'arco';
 *
 * const response = get('/foo/1234');
 *
 * @param {string} url URL to submit GET to
 * @param {Object} [config] custom configuration options for specific call
 * @returns {Promise}
 */
export const get = axios.get;

/**
 * @function head
 *
 * @description
 * perform HEAD call via AJAX
 *
 * @example
 * import {
 *  head
 * } from 'arco';
 *
 * const response = head('/foo');
 *
 * @param {string} url URL to submit HEAD to
 * @param {Object} [config] custom configuration options for specific call
 * @returns {Promise}
 */
export const head = axios.head;

/**
 * @function patch
 *
 * @description
 * perform PATCH call via AJAX
 *
 * @example
 * import {
 *  patch
 * } from 'arco';
 *
 * const response = patch('/foo/123');
 *
 * @param {string} url URL to submit PATCH to
 * @param {Object} [data] data to include in the request body on the call
 * @param {Object} [config] custom configuration options for specific call
 * @returns {Promise}
 */
export const patch = axios.patch;

/**
 * @function post
 *
 * @description
 * perform POST call via AJAX
 *
 * @example
 * import {
 *  post
 * } from 'arco';
 *
 * const response = post('/foo/123', {
 *  bar: 'baz'
 * });
 *
 * @param {string} url URL to submit POST to
 * @param {Object} [data] data to include in the request body on the call
 * @param {Object} [config] custom configuration options for specific call
 * @returns {Promise}
 */
export const post = axios.post;

/**
 * @function put
 *
 * @description
 * perform PUT call via AJAX
 *
 * @example
 * import {
 *  put
 * } from 'arco';
 *
 * const response = put('/foo/123', {
 *  bar: 'foo'
 * });
 *
 * @param {string} url URL to submit PUT to
 * @param {Object} [data] data to include in the request body on the call
 * @param {Object} [config] custom configuration options for specific call
 * @returns {Promise}
 */
export const put = axios.put;

export default {
  createInstance,
  del,
  get,
  head,
  patch,
  post,
  put,
  setDefaults
};

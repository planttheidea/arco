// external dependencies
import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';

// utils
import {
  keys
} from './utils';

export const setAjaxDefaults = ({baseURL, headers} = {}, axiosInstance = axios) => {
  if (baseURL) {
    axiosInstance.defaults.baseURL = baseURL;
  }

  if (isPlainObject(headers)) {
    const {
      del,
      get,
      head,
      patch,
      post,
      put,
      ...common
    } = headers;

    axiosInstance.defaults.headers.delete = del;
    axiosInstance.defaults.headers.get = get;
    axiosInstance.defaults.headers.head = head;
    axiosInstance.defaults.headers.patch = patch;
    axiosInstance.defaults.headers.post = post;
    axiosInstance.defaults.headers.put = put;

    keys(common).forEach((key) => {
      axiosInstance.defaults.headers.common[key] = common[key];
    });
  }

  return axiosInstance;
};

export const del = axios.delete;
export const get = axios.get;
export const head = axios.head;
export const patch = axios.patch;
export const post = axios.post;
export const put = axios.put;

export default {
  del,
  get,
  head,
  patch,
  post,
  put
};

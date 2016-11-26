// external dependencies
import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';

// utils
import {
  keys
} from './utils';

const setAjaxDefaults = ({baseURL, headers} = {}, axiosInstance = axios) => {
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

const del = axios.delete;
const get = axios.get;
const head = axios.head;
const patch = axios.patch;
const post = axios.post;
const put = axios.put;

export {del};
export {get};
export {head};
export {patch};
export {post};
export {put};

export {setAjaxDefaults};

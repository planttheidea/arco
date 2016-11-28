import test from 'ava';
import sinon from 'sinon';

import axios from 'axios';

import {
  createInstance,
  del,
  get,
  head,
  patch,
  post,
  put,
  setDefaults
} from 'src/ajax';

test('if createInstance will call axios.create with the options passed', (t) => {
  const stub = sinon.stub(axios, 'create', (item) => {
    return item;
  });

  const options = {
    foo: 'bar'
  };

  const result = createInstance(options);

  t.is(result, options);
  t.true(stub.calledOnce);

  stub.restore();
});

test('if del is the same function as axios.delete', (t) => {
  t.is(del, axios.delete);
});

test('if get is the same function as axios.get', (t) => {
  t.is(get, axios.get);
});

test('if head is the same function as axios.head', (t) => {
  t.is(head, axios.head);
});

test('if patch is the same function as axios.patch', (t) => {
  t.is(patch, axios.patch);
});

test('if post is the same function as axios.post', (t) => {
  t.is(post, axios.post);
});

test('if put is the same function as axios.put', (t) => {
  t.is(put, axios.put);
});

test('if setDefaults will update the axios defaults object', (t) => {
  const originalDefaults = {
    ...axios.defaults,
    headers: {
      ...axios.defaults.headers
    }
  };

  const newDefaults = {
    baseURL: 'http://foo.com',
    headers: {
      common: {
        'X-COMMON': 'foo'
      },
      del: {
        'X-DEL': 'foo'
      },
      get: {
        'X-GET': 'foo'
      },
      head: {
        'X-HEAD': 'foo'
      },
      patch: {
        'X-PATCH': 'foo'
      },
      post: {
        'X-POST': 'foo'
      },
      put: {
        'X-PUT': 'foo'
      }
    }
  };

  setDefaults(newDefaults);

  t.is(axios.defaults.baseURL, newDefaults.baseURL);

  Object.keys(newDefaults.headers.common).forEach((key) => {
    t.deepEqual(axios.defaults.headers.common[key], newDefaults.headers.common[key]);
  });

  Object.keys(newDefaults.headers.del).forEach((key) => {
    t.deepEqual(axios.defaults.headers.delete[key], newDefaults.headers.del[key]);
  });

  Object.keys(newDefaults.headers.get).forEach((key) => {
    t.deepEqual(axios.defaults.headers.get[key], newDefaults.headers.get[key]);
  });

  Object.keys(newDefaults.headers.head).forEach((key) => {
    t.deepEqual(axios.defaults.headers.head[key], newDefaults.headers.head[key]);
  });

  Object.keys(newDefaults.headers.patch).forEach((key) => {
    t.deepEqual(axios.defaults.headers.patch[key], newDefaults.headers.patch[key]);
  });

  Object.keys(newDefaults.headers.post).forEach((key) => {
    t.deepEqual(axios.defaults.headers.post[key], newDefaults.headers.post[key]);
  });

  Object.keys(newDefaults.headers.put).forEach((key) => {
    t.deepEqual(axios.defaults.headers.put[key], newDefaults.headers.put[key]);
  });

  axios.defaults = originalDefaults;
});
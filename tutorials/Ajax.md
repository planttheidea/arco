The absence of an AJAX library is one of the biggest complains about the `react` ecosystem, so `arco` made the inclusion of a solid, easy-to-use library a top focus. We selected [axios](https://github.com/mzabriskie/axios) based on its ease of use, promised-based API, tiny footprint, and strong usage across modern web projects.

* [AJAX methods](#ajax-methods)
* [Setup](#setup)
* [Custom instances](#custom-instances)

#### AJAX methods

We have mainly provided simple pass-through exports for the standard methods supported by `axios`:

* delete (aliased as `del` due to `delete` being a reserved keyword)
* get
* head
* patch
* post
* put

For more information about how to use these methods, please consult the [axios API documentation](https://github.com/mzabriskie/axios#axios-api).

You can individually import these methods individually or as an object collection:

```javascript
import {
  get,
  post
} from 'arco';

get(...);
post(...);

// or

import {
  ajax
} from 'arco';

ajax.get(...);
ajax.post(...);
```

#### Setup

If you want to set defaults for all your AJAX calls, you can run `setDefaults` at the beginning of your application:

```javascript
import {
  ajax
} from 'arco';

ajax.setDefaults({
  baseURL: 'http://foo.com',
  headers: {
    common: {
      'X-API-KEY': 'foo'
    }
  }
});
```

These options will be deeply merged with the existing options. Make sure to run this at the beginning of your application so all future AJAX calls reflect these defaults.

#### Custom instances

You can also create a unique instance with a specific configuration, say if you are querying different servers that expect different values for the same headers.

```javascript
import {
  ajax
} from 'arco';

const customInstance = ajax.createInstance({
  headers: {
    put: {
      'FOO': 'bar'
    }
  }
});
```

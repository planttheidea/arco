Selectors are an incredibly powerful tool for optimizing data computation, and can also greatly reduce the amount of data you need to store in state. They rely on immutable data structures, only updating if the parameters passed have changed, else they keep a cached value and return immediately. The only complaint is that there is a decent amount of code that you need to write in order to produce one, so `arco` tries to simplify it a bit.

```javascript
import {
  createSelector
} from 'arco';

const getFooBar = createSelector(['foo', 'bar[0].baz[1].bar'], (foo, bar) => {
  return `${foo} ${bar}`;
});

const state = {
  foo: 'foo',
  bar: [
    {
      baz: [
        'foo',
        {
          bar: 'bar'
        }
      ]
    }
  ]
};

getFooBar(state); // returns "foo bar" after computing it
getFooBar(state); // returns "foo bar" from cache, as nothing changed
```

The first parameter is an array of properties that you want to retrieve from state, where if they are nested then you provide the full path to the value desired as a string. Internally, `arco` will retrieve those nested values for use as parameters in the second (function) parameter.

If you wish to compose selectors, then simply provide the selector in place of the string path, and the result of that selector will be used for retrieving the paramter instead.

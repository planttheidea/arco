import test from 'ava';
import isFunction from 'lodash/isFunction';

import {
  createSelector as createReduxSelector
} from 'reselect';

import {
  createIdentitySelector,
  createSelector,
  getIdentityValue,
  getStandardSelector,
  getStructuredSelector,
  getStructuredValue
} from 'src/selectors';

test('if createIdentitySelector creates a function that returns the identity property', (t) => {
  const selector = createIdentitySelector('foo.bar');

  t.true(isFunction(selector));

  const bar = 'bar';

  const result = selector({
    foo: {
      bar
    }
  });

  t.is(result, bar);
});

test.todo('createSelector');

test('if getIdentityValue returns the value passed directly', (t) => {
  const object = {
    foo: 'bar'
  };

  const result = getIdentityValue(object);

  t.is(result, object);
});

test('if getStandardSelector will return a function that will be a selector for the value passed', (t) => {
  const paths = ['foo.bar'];
  const selectorGenerator = createReduxSelector;
  const getValue = (value) => {
    return !!value;
  };

  const selector = getStandardSelector(paths, selectorGenerator, getValue);

  t.true(isFunction(selector));

  const state = {
    foo: {
      bar: 'baz'
    }
  };

  t.true(selector(state));
});
test('if getStructuredSelector will return a function that will be a structured selector for the value passed', (t) => {
  const paths = {
    keys: ['notFoo'],
    paths: ['foo.bar']
  };
  const selectorGenerator = createReduxSelector;

  const selector = getStructuredSelector(paths, selectorGenerator);

  t.true(isFunction(selector));

  const state = {
    foo: {
      bar: 'baz'
    }
  };

  const result = selector(state);

  t.deepEqual(result, {
    notFoo: 'baz'
  });
});

test('if getStructuredValue returns a function that will map the values to the keys based on order', (t) => {
  const keys = ['foo', 'bar'];
  const values = [123, 456];

  const mapper = getStructuredValue(keys);

  t.true(isFunction(mapper));

  const result = mapper(...values);

  t.deepEqual(result, {
    foo: 123,
    bar: 456
  });
});
import test from 'ava';
import sinon from 'sinon';

import isFunction from 'lodash/isFunction';
import * as reselect from 'reselect';

import {
  createIdentitySelector,
  createSelector,
  getIdentityValue,
  getSelectorGenerator,
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

test('if createSelector creates a structured selector when properties is an object, and a standard selector when an array', (t) => {
  const state = {
    foo: 'bar'
  };

  const standardProperties = ['foo'];
  const standardSelector = createSelector(standardProperties);
  const standardResult = standardSelector(state);

  t.is(standardResult, state.foo);

  const structuredProperties = {
    keys: ['baz'],
    paths: ['foo']
  };
  const structredSelector = createSelector(structuredProperties);
  const structuredResult = structredSelector(state);

  t.deepEqual(structuredResult, {
    baz: state.foo
  });
});

test('if getIdentityValue returns the value passed directly', (t) => {
  const object = {
    foo: 'bar'
  };

  const result = getIdentityValue(object);

  t.is(result, object);
});

test('if getSelectorGenerator returns a custom memoizer when passed, otherwise returns the default creator', (t) => {
  const defaultResult = getSelectorGenerator(null, null);

  t.is(defaultResult, reselect.createSelector);

  const spy = sinon.spy(reselect, 'createSelectorCreator');

  const customResult = getSelectorGenerator(() => {}, {});

  t.not(defaultResult, customResult);
  t.true(spy.calledOnce);

  spy.restore();
});

test('if getStandardSelector will return a function that will be a selector for the value passed', (t) => {
  const paths = ['foo.bar'];
  const selectorGenerator = reselect.createSelector;
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
  const selector = getStructuredSelector(paths, reselect.createSelector);

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
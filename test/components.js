import test from 'ava';
import isFunction from 'lodash/isFunction';

import {
  addPropertyIfExists,
  assignLifecycleMethods,
  assignChildContext,
  assignInstanceValues,
  assignLocalMethods,
  connectIfReduxPropertiesExist,
  createComponent,
  getStatefulComponent,
  getStatelessComponent,
  hasGetPropsToPass
} from 'src/components';

test('if addPropertyIfExists adds the property to the object passed if the value exists', (t) => {
  const object = {};
  const key = 'foo';
  const existsValue = 'bar';
  const doesNotExistValue = null;

  const doNotAddResult = addPropertyIfExists(object, key, doesNotExistValue);

  t.is(doNotAddResult, object);

  const addResult = addPropertyIfExists(object, key, existsValue);

  t.deepEqual(addResult, {
    foo: 'bar'
  });
});

test.todo('assignLifecycleMethods');

test('if assignChildContext creates a function that is bound to the component passed', (t) => {
  const object = {};
  const fn = () => {};

  const result = assignChildContext(object, fn);

  t.true(isFunction(result.getChildContext));
});

test('if assignChildContext binds the correct this object based on the boolean passed', (t) => {
  const component = {
    props: {},
    context: {}
  };
  const falseFn = () => {
    return this;
  };
  const trueFn = function() {
    return this;
  };

  const undefinedResult = assignChildContext(component, falseFn).getChildContext();

  t.is(undefinedResult, undefined);

  const trueResult = assignChildContext(component, trueFn, true).getChildContext();

  t.is(trueResult, component);
});

test('if assignInstanceValues assigns the correct property values to the component passed', (t) => {
  const component = {};

  const result = assignInstanceValues(component);

  t.is(result, component);
  t.true(isFunction(result.getPropsToPass));
  t.deepEqual(result.methods, {});
});

test.todo('assignLocalMethods');
test.todo('connectIfReduxPropertiesExist');
test.todo('createComponent');
test.todo('getStatefulComponent');
test.todo('getStatelessComponent');

test('if hasGetPropsToPass checks for a property on the object passed that is a function', (t) => {
  const trueObject = {
    getPropsToPass() {}
  };
  const falseObject = {
    getPropsToPass: 'foo'
  };

  t.true(hasGetPropsToPass(trueObject));
  t.false(hasGetPropsToPass(falseObject));
});
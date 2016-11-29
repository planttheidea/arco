import test from 'ava';
import React, {
  Component
} from 'react';
import sinon from 'sinon';

import {
  getComponentMethods,
  getPropsAndMethods,
  isReactClass,
  isReactCompositeComponentWrapper,
  isReactElement,
  isReactEvent,
  memoize,
  memoizeSerializer,
  testParameter,
  testReducerHandler
} from 'src/utils';

test.todo('getComponentMethods');

test('if getPropsAndMethods merges the objects passed and returns a single object', (t) => {
  const foo = {
    foo: 'foo'
  };
  const bar = {
    bar: 'bar'
  };

  const result = getPropsAndMethods(foo, bar);

  t.deepEqual(result, {
    ...foo,
    ...bar
  });
});

test('if isReactClass checks if the object passed is an extension of the component class', (t) => {
  class Foo extends Component {}

  const object = {};

  t.true(isReactClass(Foo));
  t.false(isReactClass(object));
});

test.todo('isReactCompositeComponentWrapper');

test('if isReactElement checks if the object is a compiled JSX element', (t) => {
  const Foo = (() => {
    return <div/>;
  })();
  const object = {};

  t.true(isReactElement(Foo));
  t.false(isReactElement(object));
});

test('if isReactEvent checks for the nativeEvent property being of Event ancestry', (t) => {
  const currentEvent = global.Event;

  class FakeEvent {}

  global.Event = FakeEvent;

  const object = {};
  const objectWithFakeProperty = {
    nativeEvent: 'foo'
  };
  const simulatedEvent = {
    nativeEvent: new FakeEvent()
  };

  t.false(isReactEvent(object));
  t.false(isReactEvent(objectWithFakeProperty));
  t.true(isReactEvent(simulatedEvent));

  global.Event = currentEvent;
});

test.todo('memoize');
test.todo('memoizeSerializer');

test('if testParameter triggers console.error if matching function returns false', (t) => {
  const stub = sinon.stub(console, 'error');

  const foo = 'foo';

  testParameter(foo, (item) => {
    return item === foo;
  }, foo);

  t.true(stub.notCalled);

  testParameter('bar', (item) => {
    return item === foo;
  }, foo);

  t.true(stub.calledOnce);

  stub.restore();
});

test('if testReducerHandler checks if it is either an object or a function', (t) => {
  const object = {};
  const func = () => {};
  const neither = 'foo';

  t.true(testReducerHandler(object));
  t.true(testReducerHandler(func));
  t.false(testReducerHandler(neither));
});
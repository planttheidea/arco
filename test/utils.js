import test from 'ava';
import React, {Component} from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';

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
  testReducerHandler,
} from 'src/utils';

test('if getComponentMethods returns an object with two object properties for lifecycle methods and local methods', (t) => {
  const stub = sinon.stub(console, 'error');

  const lifecycle = {
    componentDidMount() {},
    componentDidUpdate() {},
  };
  const local = {
    onBar() {},
    onFoo() {},
  };
  const removed = {
    baz: null,
  };

  const options = {
    ...lifecycle,
    ...local,
    ...removed,
  };

  const result = getComponentMethods(options);

  t.deepEqual(result, {
    lifecycleMethods: {
      ...lifecycle,
    },
    localMethods: {
      ...local,
    },
  });

  t.true(stub.calledOnce);

  stub.restore();
});

test('if getPropsAndMethods merges the objects passed and returns a single object', (t) => {
  const foo = {
    foo: 'foo',
  };
  const bar = {
    bar: 'bar',
  };

  const result = getPropsAndMethods(foo, bar);

  t.deepEqual(result, {
    ...foo,
    ...bar,
  });
});

test('if isReactClass checks if the object passed is an extension of the component class', (t) => {
  class Foo extends Component {}

  const object = {};

  t.true(isReactClass(Foo));
  t.false(isReactClass(object));
});

test('if isReactCompositeComponentWrapper checks for the recursive wrapped instance props', (t) => {
  const object = {};
  const dummyWithInstance = {
    _instance: {},
  };
  const dummyWithInstanceProps = {
    _instance: {
      props: {},
    },
  };

  t.false(isReactCompositeComponentWrapper(object));
  t.false(isReactCompositeComponentWrapper(dummyWithInstance));
  t.true(isReactCompositeComponentWrapper(dummyWithInstanceProps));
});

test('if isReactElement checks if the object is a compiled JSX element', (t) => {
  const Foo = (() => <div />)();
  const object = {};

  t.true(isReactElement(Foo));
  t.false(isReactElement(object));
});

test('if isReactEvent checks for the nativeEvent property being of Event ancestry', (t) => {
  const currentEvent = global.Event;

  class FakeEvent {}

  Object.defineProperty(global, 'Event', {
    value: FakeEvent,
  });

  const object = {};
  const objectWithFakeProperty = {
    nativeEvent: 'foo',
  };
  const simulatedEvent = {
    nativeEvent: new FakeEvent(),
  };

  t.false(isReactEvent(object));
  t.false(isReactEvent(objectWithFakeProperty));
  t.true(isReactEvent(simulatedEvent));

  Object.defineProperty(global, 'Event', {
    get() {
      return currentEvent;
    },
  });
});

test('if memoize uses the memoizeSerializer and caches correctly', (t) => {
  const fn = function({foo}) {
    return foo;
  };

  const bar = 'bar';

  const spy = sinon.spy(fn);
  const memoizedFn = memoize(spy);

  const object = {
    foo: bar,
  };

  const firstResult = memoizedFn(object);

  t.is(firstResult, bar);
  t.true(spy.calledOnce);

  const secondResult = memoizedFn(object);

  t.is(secondResult, bar);
  t.true(spy.calledOnce);
});

test('if memoizeSerializer will convert the objects correctly', (t) => {
  const fn = function(foo) {
    return foo;
  };
  const Foo = ({foo}) => <div data-foo={foo} />;
  const reactElement = <Foo foo="bar" />;

  const fnResult = memoizeSerializer(fn);

  t.is(fnResult, JSON.stringify([fn.toString()]));

  const reactElementResult = memoizeSerializer(reactElement);

  t.is(reactElementResult, JSON.stringify([{foo: 'bar'}]));
});

test('if testParameter triggers console.error if matching function returns false', (t) => {
  const stub = sinon.stub(console, 'error');

  const foo = 'foo';

  testParameter(foo, (item) => item === foo, foo);

  t.true(stub.notCalled);

  testParameter('bar', (item) => item === foo, foo);

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

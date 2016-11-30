import test from 'ava';
import React from 'react';
import isFunction from 'lodash/isFunction';

import {
  addPropertyIfExists,
  assignLifecycleMethods,
  assignChildContext,
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

test('if assignLifecycleMethods creates functions that are bound to the component passed', (t) => {
  const component = {};
  const methods = {
    componentDidMount() {},
    componentDidUpdate() {}
  };

  const result = assignLifecycleMethods(component, methods);

  t.deepEqual(Object.keys(result), ['componentDidMount', 'componentDidUpdate']);
  t.true(isFunction(result.componentDidMount));
  t.true(isFunction(result.componentDidUpdate));
});

test('if assignLifecycleMethods creates functions that are bound to the component passed', (t) => {
  const component = {
    _getPropsToPass() {
      return {};
    },
    props: {}
  };
  const undefinedObject = {
    componentDidMount: () => {
      return this;
    }
  };
  const componentObject = {
    componentDidMount() {
      return this;
    }
  };

  const undefinedResult = assignLifecycleMethods(component, undefinedObject).componentDidMount();

  t.is(undefinedResult, undefined);

  const componentResult = assignLifecycleMethods(component, componentObject, true).componentDidMount();

  t.is(componentResult, component);
});

test('if assignChildContext creates a function that is bound to the component passed', (t) => {
  const object = {};
  const fn = () => {};

  const result = assignChildContext(object, fn);

  t.deepEqual(Object.keys(result), ['getChildContext']);
  t.true(isFunction(result.getChildContext));
});

test('if assignChildContext binds the correct this object based on the boolean passed', (t) => {
  const component = {
    _getPropsToPass() {
      return {};
    },
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

test('if assignLocalMethods creates functions that are bound to the component passed', (t) => {
  const component = {
    _localMethods: {}
  };
  const methods = {
    onClickFoo() {}
  };

  const result = assignLocalMethods(component, methods);

  t.deepEqual(Object.keys(result._localMethods), ['onClickFoo']);
  t.true(isFunction(result._localMethods.onClickFoo));
});

test('if connectIfReduxPropertiesExist connects the component only when the correct property exists', (t) => {
  const Foo = () => {
    return (
      <div/>
    );
  };

  const dispatch = {
    mapDispatchToProps: {}
  };
  const state = {
    mapStateToProps() {
      return {};
    }
  };
  const merge = {
    mergeProps() {
      return {};
    }
  };
  const options = {
    reduxOptions: {}
  };
  const foo = {
    foo: 'bar'
  };

  const expectedDisplayName = `Connect(${Foo.name})`;

  const dispatchResult = connectIfReduxPropertiesExist(Foo, dispatch);

  t.is(dispatchResult.displayName, expectedDisplayName);
  t.true(isFunction(dispatchResult.WrappedComponent));

  const stateResult = connectIfReduxPropertiesExist(Foo, state);

  t.is(stateResult.displayName, expectedDisplayName);
  t.true(isFunction(stateResult.WrappedComponent));

  const mergeResult = connectIfReduxPropertiesExist(Foo, merge);

  t.is(mergeResult.displayName, expectedDisplayName);
  t.true(isFunction(mergeResult.WrappedComponent));

  const optionsResult = connectIfReduxPropertiesExist(Foo, options);

  t.is(optionsResult.displayName, expectedDisplayName);
  t.true(isFunction(optionsResult.WrappedComponent));

  const fooResult = connectIfReduxPropertiesExist(Foo, foo);

  t.is(fooResult, Foo);
  t.is(fooResult.displayName, undefined);
  t.is(fooResult.WrappedComponent, undefined);
});

test.todo('createComponent');
test.todo('getStatefulComponent');
test.todo('getStatelessComponent');
import test from 'ava';
import {
  mount,
  shallow
} from 'enzyme';
import React, {
  PropTypes
} from 'react';
import sinon from 'sinon';

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

import Component from 'src/Component';

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

test('if createComponent creates a stateless higher-order component when the component passed is not a class', (t) => {
  const Foo = () => <div/>;

  const Result = createComponent(Foo);

  t.false(Foo.isPrototypeOf(Result));

  const wrapper = shallow(<Result/>);

  t.is(wrapper.find(Foo).length, 1);
});

test('if createComponent extends the component when the component passed is a class', (t) => {
  class Foo extends Component {
    render() {
      return <div/>;
    }
  }

  const Result = createComponent(Foo);

  t.true(Foo.isPrototypeOf(Result));
});

test('if getStatefulComponent extends the passed component', (t) => {
  class Foo extends Component {
    render() {
      return <div/>;
    }
  }

  const Result = getStatefulComponent(Foo, {});

  t.true(Foo.isPrototypeOf(Result));
});

test('if getStatefulComponent assigns lifecycle methods when passed as options', (t) => {
  class Foo extends Component {
    render() {
      return <div/>;
    }
  }
  const stub = sinon.stub();

  const Result = getStatefulComponent(Foo, {
    componentDidMount: stub
  });

  mount(<Result/>);

  t.true(stub.calledOnce);
});

test('if getStatefulComponent adds propTypes, contextTypes, and childContextTypes appropriately if passed', (t) => {
  class Foo extends Component {
    render() {
      return <div/>;
    }
  }

  const propTypes = {
    foo: PropTypes.string
  };
  const contextTypes = {
    bar: PropTypes.string
  };
  const childContextTypes = {
    baz: PropTypes.string
  };
  const getChildContext = sinon.spy(() => {
    return {
      baz: 'foo'
    };
  });

  const Result = getStatefulComponent(Foo, {
    propTypes,
    contextTypes,
    childContextTypes,
    getChildContext
  });

  t.deepEqual(Result.childContextTypes, childContextTypes);
  t.deepEqual(Result.propTypes, propTypes);
  t.deepEqual(Result.contextTypes, contextTypes);

  mount(<Result/>);

  t.true(getChildContext.calledOnce);
});

test('if getStatelessComponent wraps the passed component in a higher-order component', (t) => {
  const Foo = () => <div/>;

  const Result = getStatelessComponent(Foo, {});

  t.true(Component.isPrototypeOf(Result));
});

test('if getStatelessComponent assigns lifecycle methods when passed as options', (t) => {
  const Foo = () => <div/>;
  const stub = sinon.stub();

  const Result = getStatelessComponent(Foo, {
    componentDidMount: stub
  });

  mount(<Result/>);

  t.true(stub.calledOnce);
});

test('if getStatelessComponent assigns local methods when passed as options and passes them down as props', (t) => {
  const Foo = ({onClickButton}) => {
    return (
      <div>
        <button
          className="button"
          onClick={onClickButton}
        />
      </div>
    )
  };
  const stub = sinon.stub();

  const Result = getStatelessComponent(Foo, {
    onClickButton: stub
  });

  const wrapper = mount(<Result/>);

  wrapper.find('.button').simulate('click');

  t.true(stub.calledOnce);
});

test('if getStatelessComponent adds propTypes, contextTypes, and childContextTypes appropriately if passed', (t) => {
  const Foo = () => <div/>;

  const propTypes = {
    foo: PropTypes.string
  };
  const contextTypes = {
    bar: PropTypes.string
  };
  const childContextTypes = {
    baz: PropTypes.string
  };
  const getChildContext = sinon.spy(() => {
    return {
      baz: 'foo'
    };
  });

  const Result = getStatelessComponent(Foo, {
    propTypes,
    contextTypes,
    childContextTypes,
    getChildContext
  });

  t.deepEqual(Result.childContextTypes, childContextTypes);
  t.deepEqual(Foo.propTypes, propTypes);
  t.deepEqual(Foo.contextTypes, contextTypes);

  mount(<Result/>);

  t.true(getChildContext.calledOnce);
});
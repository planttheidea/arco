import test from 'ava';
import React from 'react';
import {
  mount
} from 'enzyme';

import isElement from 'lodash/isElement';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';

import {
  Component
} from 'src/Component';

test('if Component is an extension of the React.Component class', (t) => {
  class Foo extends Component {
    render() {
      return <div/>;
    }
  }

  t.true(React.Component.isPrototypeOf(Foo));
});

test('if Component produces a class that has correct properties bound to the instance', (t) => {
  class Foo extends Component {
    render() {
      return <div/>;
    }
  }

  const wrapper = mount(<Foo foo="bar"/>);

  t.true(isFunction(wrapper.node.getDOMNode));
  t.true(isFunction(wrapper.node._getPropsToPass));
  t.true(isPlainObject(wrapper.node._localMethods));

  wrapper.unmount();
});

test('if Component passes class and context to the render method', async (t) => {
  class Foo extends Component {
    render(props, context) {
      t.true(isPlainObject(props));
      t.deepEqual(props, {
        foo: 'bar'
      });
      t.true(isPlainObject(context));

      return <div/>;
    }
  }

  const wrapper = await mount(<Foo foo="bar"/>);

  wrapper.unmount();
});

test('if getDOMNode actually gets the correct DOM node', async (t) => {
  class Foo extends Component {
    componentDidMount() {
      const container = this.getDOMNode();
      const child = this.getDOMNode('.foo');

      t.true(isElement(container));
      t.is(container.tagName.toLowerCase(), 'div');

      t.true(isElement(child));
      t.is(child.tagName.toLowerCase(), 'span');
    }

    render() {
      return (
        <div>
          <span className="foo">
            bar
          </span>
        </div>
      );
    }
  }

  const wrapper = await mount(<Foo foo="bar"/>);

  wrapper.unmount();
});
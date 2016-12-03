import test from 'ava';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider
} from 'react-redux';
import configureMockStore from 'redux-mock-store';

import {
  render
} from 'src/index';

const createMockStore = configureMockStore();

test('if render will return a Provider-wrapped app that is bound to the element', async (t) => {
  const component = <div/>;
  const renderElement = document.body;
  const store = createMockStore({});

  const stub = sinon.stub(ReactDOM, 'render', (JSX, element) => {
    t.is(JSX.type, Provider);
    t.is(JSX.props.children.type, 'div');
    t.is(JSX.props.store, store);
    t.is(element, renderElement);
  });

  await render(component, renderElement, store);

  t.true(stub.calledOnce);

  stub.restore();
});
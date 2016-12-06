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

test.serial('if render will return a Provider-wrapped app that is bound to the element', async (t) => {
  const component = <div/>;
  const renderElement = document.createElement('div');
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

test.serial('if render will append a child div to the body when the document.body is used for rendering', async (t) => {
  const component = <div/>;
  const renderElement = document.body;
  const store = createMockStore({});

  await render(component, renderElement, store);

  const container = document.querySelector('#app-container');

  t.not(container, null);
  t.is(container.tagName.toLowerCase(), 'div');
});
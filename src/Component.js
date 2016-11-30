// external dependencies
import bind from 'lodash/bind';
import React from 'react';
import {
  findDOMNode
} from 'react-dom';

// utils
import {
  getPropsAndMethods,
  memoize
} from './utils';

/**
 * @class Component
 * @augments React.Component
 *
 * @classdesc
 * extension of React.Component which includes some helper utilities and allows for state
 *
 * @example
 *
 * import createComponent, {
 *  Component
 * } from 'arco';
 *
 * // can still create your lifecycle methods as external methods
 * const componentDidUpdate = function(props) {
 *  console.log('Updated with props: ', props);
 *  console.log('Updated with state: ', this.state); // state accessed through this
 * };
 *
 * class Foo extends Component {
 *  state = {
 *    foo: null
 *  };
 *
 *  onClickButton = () => {
 *    this.setState({
 *      foo:  'bar'
 *    });
 *  };
 *
 *  render(props) {
 *    return (
 *      <button
 *        onClick={this.onClickButton}
 *        type="button"
 *      >
 *        Click me
 *      </button>
 *    );
 *  }
 * }
 */
export class Component extends React.Component {
  constructor(...args) {
    super(...args);

    this._getPropsToPass = memoize(getPropsAndMethods);
    this._localMethods = {
      getDOMNode: this.getDOMNode
    };
    this.render = bind(this.render, this, this.props, this.context);
  }

  /**
   * @function getDOMNode
   *
   * @memberOf Component
   * @instance
   *
   * @description
   * if the selector is passed, query the component to find the matching DOM element,
   * else return the DOM element of the component itself
   *
   * @example
   * import createComponent, {
   *  Component
   * } from 'arco';
   *
   * // function instead of arrow function to retain the "this"
   * const componentDidMount = function() {
   *   const div = this.getDOMNode(); // gets the top-level div node
   *   const input = this.getDOMNode('.input'); // gets the input child node
   * };
   *
   * class Foo extends Component {   *
   *  render() {
   *    return (
   *      <div>
   *        <input
   *          className="input"
   *          type="text"
   *        />
 *        </div>
   *    );
   *  }
   * }
   *
   * export default createComponent(Foo, {
   *  componentDidMount
   * });
   *
   * @param {string} [selector] CSS selector to query component for
   * @returns {HTMLElement}
   */
  getDOMNode = (selector) => {
    const domNode = findDOMNode(this);

    if (!!selector) {
      return domNode.querySelector(selector);
    }

    return domNode;
  };
}

export default Component;

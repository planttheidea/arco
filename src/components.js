// external dependencies
import isFunction from 'lodash/isFunction';
import React, {
  Component as ReactComponent
} from 'react';
import {
  findDOMNode
} from 'react-dom';
import {
  connect
} from 'react-redux';

// constants
import {
  ERROR_TYPES,

  keys
} from './constants';

// utils
import {
  getComponentMethods,
  getPropsAndMethods,
  isReactClass,
  isReactEvent,
  memoize,
  testParameter
} from './utils';

/**
 * @module components
 */

/**
 * @private
 *
 * @function addPropertyIfExists
 *
 * @description
 * add to component the property if the value exists
 *
 * @param {ReactComponent} component component to add the property to
 * @param {string} property property name
 * @param {*} value value of the property to assign
 * @returns {ReactComponent}
 */
export const addPropertyIfExists = (component, property, value) => {
  if (!!value) {
    component[property] = value;
  }

  return component;
};

/**
 * @private
 *
 * @function assignChildContext
 *
 * @description
 * assign the child context to the component passed
 * 
 * @param {ReactComponent} component component to assign child context to
 * @param {function} getChildContext method for getting child context
 * @returns {ReactComponent}
 */
export const assignChildContext = (component, getChildContext) => {
  testParameter(getChildContext, isFunction, 'getChildContext is not a function', ERROR_TYPES.TYPE);

  component.getChildContext = function() {
    return getChildContext(component.props, component.context);
  };

  return component;
};

/**
 * @private
 *
 * @function assignInstanceValues
 *
 * @description
 * assign the instance values to the component passed
 * 
 * @param {ReactComponent} component component to assign instance values to
 * @returns {ReactComponent}
 */
export const assignInstanceValues = (component) => {
  component.getPropsToPass = memoize(getPropsAndMethods);
  component.methods = {};

  return component;
};

/**
 * @private
 *
 * @function connectIfReduxPropertiesExist
 *
 * @description
 * if there are redux-specific options present, connect the component
 *
 * @param {ReactComponent} component component to connect to redux if applicable
 * @param {function|Object} mapDispatchToProps functions wrapped in dispatch to pass as props
 * @param {function} mapStateToProps state to pass as props
 * @param {function} mergeProps function to merge store state with local props
 * @param {Object} reduxOptions additional options to pass to @connect
 * @returns {ReactComponent}
 */
export const connectIfReduxPropertiesExist = (component, {
  mapDispatchToProps,
  mapStateToProps,
  mergeProps,
  reduxOptions
}) => {
  if (mapDispatchToProps || mapStateToProps || mergeProps || reduxOptions) {
    return connect(mapStateToProps, mapDispatchToProps, mergeProps, reduxOptions)(component);
  }

  return component;
};

/**
 * @private
 *
 * @function hasGetPropsToPass
 *
 * @description
 * does the component contain the getPropsToPass method
 *
 * @param {function} getPropsToPass method to get all props to pass down
 * @returns {boolean}
 */
export const hasGetPropsToPass = ({getPropsToPass}) => {
  return isFunction(getPropsToPass);
};

/**
 * @private
 *
 * @function assignLifecycleMethods
 *
 * @description
 * assign the lifecycle methods to the instance
 *
 * @param {ReactComponent|StatefulComponent} component component to assign lifecycle methods to
 * @param {Object} lifecycleMethods map of lifecycle methods
 * @returns {ReactComponent}
 */
export const assignLifecycleMethods = (component, lifecycleMethods) => {
  const getAllProps = () => {
    if (hasGetPropsToPass(component)) {
      return component.getPropsToPass(component.props, component.methods);
    }

    return component.props;
  };

  keys(lifecycleMethods).forEach((key) => {
    testParameter(lifecycleMethods[key], isFunction,
      `${key} is not a function, skipping assignment to instance.`, ERROR_TYPES.TYPE);

    component[key] = function(props, state, context) {
      let args = [getAllProps()];

      if (props) {
        args.push(props);
      }

      args.push(component.context, context);

      return lifecycleMethods[key](...args);
    };
  });

  return component;
};

/**
 * @private
 *
 * @function assignLocalMethods
 *
 * @description
 * assign the local methods to the instance
 *
 * @param {ReactComponent} component component to assign local methods to
 * @param {Object} localMethods map of methods accessible locally through props
 * @returns {ReactComponent}
 */
export const assignLocalMethods = (component, localMethods) => {
  const getAllProps = () => {
    if (hasGetPropsToPass(component)) {
      return component.getPropsToPass(component.props, component.methods);
    }

    return component.props;
  };

  keys(localMethods).forEach((key) => {
    component.methods[key] = (...args) => {
      const [
        event,
        ...restOfArgs
      ] = args;

      const isFirstArgEvent = isReactEvent(event);

      let argsToPass = [getAllProps()];

      if (isFirstArgEvent) {
        argsToPass.unshift(event);
      }

      argsToPass.push(component.context);
      argsToPass.push(isFirstArgEvent ? restOfArgs : args);

      return localMethods[key].apply(undefined, argsToPass);
    };
  });

  /**
   * @private
   *
   * @function getDOMNode
   *
   * @description
   * if a selector is passed get the descendant of the component that matches the selector,
   * else return the DOM node of the component itself
   *
   * @param {string} selector
   * @returns {HTMLElement|null}
   */
  component.methods.getDOMNode = (selector) => {
    const node = findDOMNode(component);

    if (!selector) {
      return node;
    }

    if (node) {
      return node.querySelector(selector);
    }
  };

  return component;
};

/**
 * @private
 *
 * @function getStatefulComponent
 *
 * @description
 * get the stateful component that, if the options are passed, is connected to redux
 *
 * @param {Component} PassedComponent component wrapped by arco
 * @param {Object} options options to apply to the HOC created by arco
 * @returns {Component}
 */
export const getStatefulComponent = (PassedComponent, options) => {
  const {
    childContextTypes,
    contextTypes,
    getChildContext,
    mapDispatchToProps: mapDispatchToPropsIgnored,
    mapStateToProps: mapStateToPropsIgnored,
    mergeProps: mergePropsIgnored,
    propTypes,
    reduxOptions: reduxOptionsIgnored,
    ...restOfOptions
  } = options;

  const {
    lifecycleMethods
  } = getComponentMethods(restOfOptions);

  class StatefulComponent extends PassedComponent {
    constructor(...args) {
      super(...args);

      assignLifecycleMethods(this, lifecycleMethods);

      if (childContextTypes && getChildContext) {
        assignChildContext(this, getChildContext);
      }
    }

    render() {
      return super.render(this.props, this.context);
    }
  }

  addPropertyIfExists(StatefulComponent, 'childContextTypes', childContextTypes);
  addPropertyIfExists(StatefulComponent, 'contextTypes', contextTypes);
  addPropertyIfExists(StatefulComponent, 'propTypes', propTypes);

  return connectIfReduxPropertiesExist(StatefulComponent, options);
};

/**
 * @private
 *
 * @function getStatelessComponent
 *
 * @description
 * get the stateless component HOC that has local and lifecycle methods based on
 * the options, as well as possibly being connected to redux
 *
 * @param {function} PassedComponent component wrapped by arco
 * @param {Object} options options to apply to the HOC created by arco
 * @returns {Component}
 */
export const getStatelessComponent = (PassedComponent, options) => {
  const {
    childContextTypes,
    contextTypes,
    getChildContext,
    mapDispatchToProps: mapDispatchToPropsIgnored,
    mapStateToProps: mapStateToPropsIgnored,
    mergeProps: mergePropsIgnored,
    propTypes,
    reduxOptions: reduxOptionsIgnored,
    ...restOfOptions
  } = options;

  const {
    lifecycleMethods,
    localMethods
  } = getComponentMethods(restOfOptions);

  addPropertyIfExists(PassedComponent, 'contextTypes', contextTypes);
  addPropertyIfExists(PassedComponent, 'propTypes', propTypes);

  class StatelessComponent extends ReactComponent {
    constructor(...args) {
      super(...args);

      assignInstanceValues(this);
      assignLifecycleMethods(this, lifecycleMethods);
      assignLocalMethods(this, localMethods);

      if (childContextTypes && getChildContext) {
        assignChildContext(this, getChildContext);
      }
    }

    render() {
      const propsToPass = this.getPropsToPass(this.props, this.methods);

      return (
        <PassedComponent {...propsToPass}/>
      );
    }
  }

  addPropertyIfExists(StatelessComponent, 'childContextTypes', childContextTypes);

  return connectIfReduxPropertiesExist(StatelessComponent, options);
};

/**
 * @function createComponent
 *
 * @description
 * create a simple component where props are rendered
 *
 * @example
 * import createComponent from 'arco';
 *
 * const OPTIONS = {
 *  onButtonClick() {
 *    alert('hello!');
 *  }
 * };
 *
 * const Foo = ({onButtonClick}) => {
 *  return (
 *    <button
 *      onClick={onButtonClick}
 *      type="button"
 *    >
 *      Click me!
 *    </button>
 *  );
 * };
 *
 * export default createComponent(Foo, OPTIONS);
 *
 * @param {Component|function} PassedComponent component to wrap
 * @param {Object} [options={}] options to apply to the HOC created by arco
 * @returns {Component|function(Component): Component}
 */
export const createComponent = (PassedComponent, options = {}) => {
  if (isReactClass(PassedComponent)) {
    return getStatefulComponent(PassedComponent, options);
  }

  return getStatelessComponent(PassedComponent, options);
};

export {ReactComponent as StatefulComponent};

export default createComponent;

// external dependencies
import isFunction from 'lodash/isFunction';
import React from 'react';
import {connect} from 'react-redux';

// constants
import {
  ERROR_TYPES,
  keys,
} from './constants';

// utils
import {
  getComponentMethods,
  isReactClass,
  isReactEvent,
  testParameter,
} from './utils';

// components
import Component from './Component';

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
 * @param {Component} component component to add the property to
 * @param {string} property property name
 * @param {*} value value of the property to assign
 * @returns {Component}
 */
export const addPropertyIfExists = (component, property, value) => {
  if (value) {
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
 * @param {Component} component component to assign child context to
 * @param {function} getChildContext method for getting child context
 * @param {boolean} [canAccessThis=false] can the method access the instance
 * @returns {Component}
 */
export const assignChildContext = (component, getChildContext, canAccessThis = false) => {
  testParameter(getChildContext, isFunction, 'getChildContext is not a function', ERROR_TYPES.TYPE);

  const boundThis = canAccessThis ? component : undefined;

  component.getChildContext = () => getChildContext.call(boundThis, component.props, component.context);

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
 * @param {Component} component component to connect to redux if applicable
 * @param {function|Object} mapDispatchToProps functions wrapped in dispatch to pass as props
 * @param {function} mapStateToProps state to pass as props
 * @param {function} mergeProps function to merge store state with local props
 * @param {Object} reduxOptions additional options to pass to @connect
 * @returns {Component}
 */
export const connectIfReduxPropertiesExist = (
  component,
  {mapDispatchToProps, mapStateToProps, mergeProps, reduxOptions}
) => {
  if (mapDispatchToProps || mapStateToProps || mergeProps || reduxOptions) {
    return connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
      reduxOptions
    )(component);
  }

  return component;
};

/**
 * @private
 *
 * @function getAllPropsToPass
 *
 * @description
 * combine normal props with local methods for all props to pass
 *
 * @param {Component} component component to get the props and local methods from
 * @param {function} [component._getPropsToPass] method to retrieve combined props
 * @param {Object} [component._localMethods] local methods assigned to the HOC instance
 * @param {Object} [component.props] props passed to the HOC
 * @returns {Object}
 */
export const getAllPropsToPass = (component) => component._getPropsToPass(component.props, component._localMethods);

/**
 * @private
 *
 * @function assignLifecycleMethods
 *
 * @description
 * assign the lifecycle methods to the instance
 *
 * @param {Component|StatefulComponent} component component to assign lifecycle methods to
 * @param {function} component._getPropsToPass function to retrieve all props to pass down
 * @param {Object} component._localMethods local methods to add to props passed down
 * @param {Object} component.props actual props to pass down
 * @param {Object} lifecycleMethods map of lifecycle methods
 * @param {boolean} [canAccessThis=false] can the method access the instance
 * @returns {Component}
 */
export const assignLifecycleMethods = (component, lifecycleMethods, canAccessThis = false) => {
  const appliedThis = canAccessThis ? component : undefined;

  keys(lifecycleMethods).forEach((key) => {
    testParameter(
      lifecycleMethods[key],
      isFunction,
      `${key} is not a function, skipping assignment to instance.`,
      ERROR_TYPES.TYPE
    );

    component[key] = (props) => {
      let args = [getAllPropsToPass(component)];

      if (props) {
        args.push(props);
      }

      args.push(component.context);

      return lifecycleMethods[key].apply(appliedThis, args);
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
 * @param {Component} component component to assign local methods to
 * @param {function} component._getPropsToPass function to retrieve all props to pass down
 * @param {Object} component._localMethods local methods to add to props passed down
 * @param {Object} localMethods map of methods accessible locally through props
 * @returns {Component}
 */
export const assignLocalMethods = (component, localMethods) => {
  keys(localMethods).forEach((key) => {
    component._localMethods[key] = (...args) => {
      const [event, ...restOfArgs] = args;

      const isFirstArgEvent = isReactEvent(event);

      let argsToPass = [getAllPropsToPass(component)];

      if (isFirstArgEvent) {
        argsToPass.unshift(event);
      }

      argsToPass.push(component.context);
      argsToPass.push(isFirstArgEvent ? restOfArgs : args);

      return localMethods[key].apply(undefined, argsToPass);
    };
  });

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

  const {lifecycleMethods} = getComponentMethods(restOfOptions);

  class StatefulComponent extends PassedComponent {
    constructor(...args) {
      super(...args);

      assignLifecycleMethods(this, lifecycleMethods, true);

      if (childContextTypes && getChildContext) {
        assignChildContext(this, getChildContext, true);
      }
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
 * @param {Component|function} PassedComponent component wrapped by arco
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

  const {lifecycleMethods, localMethods} = getComponentMethods(restOfOptions);

  addPropertyIfExists(PassedComponent, 'contextTypes', contextTypes);
  addPropertyIfExists(PassedComponent, 'propTypes', propTypes);

  class StatelessComponent extends Component {
    constructor(...args) {
      super(...args);

      assignLifecycleMethods(this, lifecycleMethods);
      assignLocalMethods(this, localMethods);

      if (childContextTypes && getChildContext) {
        assignChildContext(this, getChildContext);
      }
    }

    render() {
      const propsToPass = this._getPropsToPass(this.props, this._localMethods);

      return <PassedComponent {...propsToPass} />;
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

export default createComponent;

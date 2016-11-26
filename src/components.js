// external dependencies
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
  keys
} from './constants';

// utils
import {
  getComponentMethods,
  getPropsAndMethods,
  isReactClass,
  isReactEvent,
  memoize
} from './utils';

/**
 * get the stateful component that, if the options are passed, is connected to redux
 *
 * @param {Component} PassedComponent
 * @param {Object} options
 * @returns {Component}
 */
const getStatefulComponent = (PassedComponent, options) => {
  const {
    contextTypes,
    mapDispatchToProps,
    mapStateToProps,
    mergeProps,
    propTypes,
    reduxOptions
  } = options;

  if (contextTypes) {
    PassedComponent.contextTypes = contextTypes;
  }

  if (propTypes) {
    PassedComponent.propTypes = propTypes;
  }

  class StatefulComponent extends PassedComponent {
    render() {
      return super.render();
    }
  }

  if (mapDispatchToProps || mapStateToProps || mergeProps || reduxOptions) {
    return connect(mapStateToProps, mapDispatchToProps, mergeProps, reduxOptions)(StatefulComponent);
  }

  return StatefulComponent;
};

/**
 * get the stateless component HOC that has local and lifecycle methods based on
 * the options, as well as possibly being connected to redux
 *
 * @param {function} PassedComponent
 * @param {Object} options
 * @returns {Component}
 */
const getStatelessComponent = (PassedComponent, options) => {
  const {
    childContextTypes,
    contextTypes,
    getChildContext,
    mapDispatchToProps,
    mapStateToProps,
    mergeProps,
    propTypes,
    reduxOptions,
    ...restOfOptions
  } = options;

  const {
    lifecycleMethods,
    localMethods
  } = getComponentMethods(restOfOptions);

  if (contextTypes) {
    PassedComponent.contextTypes = contextTypes;
  }

  if (propTypes) {
    PassedComponent.propTypes = propTypes;
  }

  class StatelessComponent extends ReactComponent {
    constructor(...args) {
      super(...args);

      this.assignLifecycleMethods(lifecycleMethods);
      this.assignLocalMethods(localMethods);

      if (childContextTypes && getChildContext) {
        this.assignChildContext();
      }
    }

    getPropsToPass = memoize(getPropsAndMethods);
    methods = {};

    assignChildContext = () => {
      this.getChildContext = function() {
        return getChildContext(this.getPropsToPass(this.props, this.methods), this.context);
      };
    };

    /**
     * assign the lifecycle methods to the instance
     *
     * @param {Object} lifecycleMethods
     */
    assignLifecycleMethods = (lifecycleMethods) => {
      keys(lifecycleMethods).forEach((key) => {
        const isMethodUnmount = key === 'componentWillUnmount';

        this[key] = (props, state, context) => {
          let args = [this.getPropsToPass(this.props, this.methods)];

          if (props) {
            args.push(props);
          }

          args.push(this.context, context);

          if (isMethodUnmount) {
            this.domNode = null;
          }

          return lifecycleMethods[key](...args);
        };
      });
    };

    /**
     * assign the local methods to the instance
     *
     * @param {Object} localMethods
     */
    assignLocalMethods = (localMethods) => {
      keys(localMethods).forEach((key) => {
        this.methods[key] = (...args) => {
          const [
            event,
            ...restOfArgs
          ] = args;

          const isFirstArgEvent = isReactEvent(event);

          let argsToPass = [this.getPropsToPass(this.props, this.methods)];

          if (isFirstArgEvent) {
            argsToPass.unshift(event);
          }

          argsToPass.push(this.context);
          argsToPass.push(isFirstArgEvent ? restOfArgs : args);

          return localMethods[key].apply(undefined, argsToPass);
        };
      });

      this.methods.getDOMNode = this.getDOMNode;
    };

    getDOMNode = () => {
      return findDOMNode(this);
    };

    render() {
      return (
        <PassedComponent {...this.getPropsToPass(this.props, this.methods)}/>
      );
    }
  }

  if (childContextTypes) {
    StatelessComponent.childContextTypes = childContextTypes;
  }

  if (mapDispatchToProps || mapStateToProps || mergeProps || reduxOptions) {
    return connect(mapStateToProps, mapDispatchToProps, mergeProps, reduxOptions)(StatelessComponent);
  }

  return StatelessComponent;
};

/**
 * create a simple component where props are rendered
 *
 * @param {Component|function} PassedComponent
 * @param {Object} options={}
 * @returns {Component|function(Component): Component}
 */
const createComponent = (PassedComponent, options = {}) => {
  if (isReactClass(PassedComponent)) {
    return getStatefulComponent(PassedComponent, options);
  }

  return getStatelessComponent(PassedComponent, options);
};

export {ReactComponent as StatefulComponent};

export default createComponent;

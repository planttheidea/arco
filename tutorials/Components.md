Components are comprised of two pieces, a `react` component and the options passed that enhance that component.

* [Import](#import)
* [Creating a component](#creating-a-component)
* [Options](#options)
    * [Lifecycle methods](#lifecycle-methods)
    * [Child context](#child-context)
    * [Local methods](#local-methods)
    * [Additional methods](#additional-methods)
    * [Stateful components](#stateful-components)

#### Import

For any component creation, you simply need to import the `createComponent` method from `arco`:

```javascript
import createComponent from 'arco';
```

#### Creating a component

If you want to build a simple presentational component, you do not need to provide any options:

```javascript
const Foo = (props) => {
  ...
};

export default createComponent(Foo);
```

Nothing crazy here, pretty much the same as you normally would do for functional components, but the real benefits come when we add some options.

## Options

There are a number of options that can be passed as a second parameter to `createComponent` which enhance the capabilities of ordinary functional components in `react`.

#### Lifecycle methods

All lifecycle methods other than `constructor` are supported, and they have been modified to receive props and context as parameters so that they can be built as pure functions. Example:

```javascript
// most lifecycle methods will receive the current props and context
const componentDidMount = (props, context) => {
  console.log('Mounted with props: ', props);
  console.log('Mounted with context: ', context);
};

// componentWillReceiveProps gets props, nextProps, context, and nextContext
const componentWillReceiveProps = (props, nextProps, context, nextContext) => {
  console.log('Will update from current props: ', props, ' to new props: ', nextProps);
  console.log('Will update from current context: ', context, ' to new context: ', nextContext);
};

// componentDidUpdate gets the same treatment as componentWillReceiveProps, but with previous instead of next
const componentDidUpdate = (props, previousProps, context, previousContext) => {
  console.log('Update with current props: ', props, ' from previous props: ', previousProps);
  console.log('Update with current context: ', context, ' from previous context: ', previousContext);
};
```

And to apply them:

```javascript
export default createComponent(Foo, {
  componentDidMount,
  componentWillReceiveProps,
  componentDidUpdate
});
```

#### Child context

You can also add child context to the component by providing the same kind of parameters as options:

```javascript
import createComponent, {
  PropTypes
} from 'arco';

const childContextTypes = {
  foo: PropTypes.string
};

// props and context are injected just like lifecycle methods
const getChildContext = (props, context) => {
  return {
    foo: 'bar'
  };
};
```

And apply them in the same way:

```javascript
export default createComponent(Foo, {
  childContextTypes,
  getChildContext
});
```

#### Local methods

In addition to `react-`specific methods and properties, you can provide local methods that will have the props and context injected in the same way as the lifecycle methods. These are especially useful when providing event methods to elements in the component:

```javascript
const mapDispatchToProps = {
  someAction
};

// props and context are injected into the method following the event
const onClickButton = (event, props) => {
  props.someAction('data');
};

const Foo = ({onClickButton}) => {
  return (
    <button onClick={onClickButton}>
      Click me!
    </button>
  )
};

export default createComponent(Foo, {
  mapDispatchToProps,
  onClickButton
});
```

While you can use this for any instance method, it is advised to only use this for event-driven methods. You can just as easily create pure functions that exist outside of the `options` to perform additional computation.

#### Additional methods

On top of the methods that you can pass in as options, there are some methods that are included for you.

*getDOMNode([selector]): HTMLElement*

This method accepts an optional selector, which if provided will retrieve a child node of the component that matches the selector, else returns the node of the component itself.

```javascript
const getInput = ({getDOMNode}) => {
  return getDOMNode('input');
};

const resetInputIfEscape = (event, props) => {
  if (event.which === 27) {
    const input = getInput(props);
      
    input.value = '';
  }
};

const Foo = ({resetInputIfEscape}) => {
  return (
    <div>
      <label>
        Some input
      </label>
      
      <input
        onKeyDown={resetInputIfEscape}
        type="text"
      />
    </div>
  );
};

export default createComponent(Foo, {
  resetInputIfEscape
})
```

#### Stateful components

While function components are the preferred usage of `arco`, you can use stateful components as well.

```javascript
import createComponent, {
  StatefulComponent
} from 'arco';

const componentDidMount = (props) => {
  console.log('Mounted with props: ', props);
};

class Foo extends StatefulComponent {
  state = {
    foo: ''
  };
  
  render() {
    const {
      foo
    } = this.state;
    
    if (foo) {
      return (
        <span>foo</span>
      );
    }
    
    return (
      <span>bar</span>
    );
  }
}

export default createComponent(Foo, {
  componentDidMount
});
```

StatefulComponent is a mirror image of `React.Component`, so consult the standard React documentation for usage.

Stateful components can receive pure lifecycle methods as options (which override any declared in the `class` itself), however local and additional methods are not provided.

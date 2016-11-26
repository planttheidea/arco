import createComponent, {
  PropTypes,
  findDOMNode
} from '../../src';

import jile from 'react-jile';

// actions
import * as actions from '../modules/app';

const STYLES = {
  '.h1': {
    textAlign: 'center'
  },
  '.inputContainer': {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 15,
    width: '100%'
  },
  '.input': {
    display: 'block',
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 0
  },
  '.button': {
    display: 'block',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: 15
  }
};

const mapStateToProps = ({app}) => {
  return app;
};

const mapDispatchToProps = {
  ...actions
};

const componentDidMount = ({getInput}) => {
  setTimeout(() => {
    const input = getInput();

    input.focus();
  }, 100);
};

const componentWillUnmount = ({clearRecentlyAdded}) => {
  clearRecentlyAdded();
};

const getInput = ({getDOMNode}) => {
  return getDOMNode().querySelector('input');
};

const onClickButton = (e, {addTodo, getInput, resetInput}) => {
  const input = getInput();
  const value = input.value;

  if (value) {
    addTodo(value);
    resetInput();
  }
};

const onKeyDownInput = (e, {addTodo, resetInput}) => {
  const value = e.currentTarget.value;

  if (e.which === 13 && value) {
    addTodo(value);
    resetInput();
  }
};

const resetInput = ({getInput}) => {
  const input = getInput();

  input.value = '';
  input.focus();
};

const OPTIONS = {
  mapStateToProps,
  mapDispatchToProps,
  componentDidMount,
  componentWillUnmount,
  getInput,
  onClickButton,
  onKeyDownInput,
  resetInput
};

const Add = ({onClickButton, onKeyDownInput, recentlyAdded, selectors}) => {
  return (
    <section>
      <h1 className={selectors.h1}>
        Add Todo
      </h1>

      <div className={selectors.inputContainer}>
        <input
          className={selectors.input}
          defaultValue=""
          onKeyDown={onKeyDownInput}
          type="text"
        />

        <button
          className={selectors.button}
          onClick={onClickButton}
          type="button"
        >
          Add Todo
        </button>
      </div>

      {recentlyAdded && (
        <div>
          Successfully added {recentlyAdded}.
        </div>
      )}
    </section>
  );
};

Add.propTypes = {
  onClickButton: PropTypes.func.isRequired,
  selectors: PropTypes.object.isRequired
};

export default jile(STYLES)(createComponent(Add, OPTIONS));

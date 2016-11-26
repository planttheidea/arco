import createComponent, {
  PropTypes,
  findDOMNode
} from '../../src';

// actions
import * as actions from '../modules/app';

// styles
import selectors from '../css/pages/AddTodo.css';

/**
 * map the app state to props
 *
 * @param {Object} app
 * @returns {Object}
 */
const mapStateToProps = ({app}) => {
  return app;
};

const mapDispatchToProps = {
  ...actions
};

/**
 * on mount wait for render and focus on the input
 *
 * @param {function} getInput
 */
const componentDidMount = ({getInput}) => {
  setTimeout(() => {
    const input = getInput();

    input.focus();
  }, 100);
};

/**
 * on unmount, clear the recently-added message
 *
 * @param {function} clearRecentlyAdded
 */
const componentWillUnmount = ({clearRecentlyAdded}) => {
  clearRecentlyAdded();
};

/**
 * get the input element that is a child of the component node
 *
 * @param {function}getDOMNode
 * @returns {HTMLElement}
 */
const getInput = ({getDOMNode}) => {
  return getDOMNode().querySelector('input');
};

/**
 * on button click, get the input value and add the todo for it
 *
 * @param {Event} e
 * @param {function} addTodo
 * @param {function} getInput
 * @param {function} resetInput
 */
const onClickButton = (e, {addTodo, getInput, resetInput}) => {
  const input = getInput();
  const value = input.value;

  if (value) {
    addTodo(value);
    resetInput();
  }
};

/**
 * on keydown, if enter is pressed then save the todo
 *
 * @param {Event} e
 * @param {function} addTodo
 * @param {function} resetInput
 */
const onKeyDownInput = (e, {addTodo, resetInput}) => {
  const value = e.currentTarget.value;

  if (e.which === 13 && value) {
    addTodo(value);
    resetInput();
  }
};

/**
 * reset the input to its original value
 *
 * @param {function} getInput
 */
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

const Add = ({onClickButton, onKeyDownInput, recentlyAdded}) => {
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
  onClickButton: PropTypes.func.isRequired
};

export default createComponent(Add, OPTIONS);

import createComponent, {
  PropTypes,
  findDOMNode
} from '../../src';

// actions
import * as actions from '../modules/app/appActions';

// styles
import selectors from '../css/pages/AddTodo.css';

/**
 * get the input element that is a child of the component node
 *
 * @param {function}getDOMNode
 * @returns {HTMLElement}
 */
const getInput = (getDOMNode) => {
  return getDOMNode().querySelector('input');
};

/**
 * reset the input to its original value
 *
 * @param {HTMLInputElement} input
 */
const resetInput = (input) => {
  input.value = '';
  input.focus();
};

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
 * @param {function} getDOMNode
 */
const componentDidMount = ({getDOMNode}) => {
  setTimeout(() => {
    const input = getInput(getDOMNode);

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
 * on button click, get the input value and add the todo for it
 *
 * @param {Event} e
 * @param {function} addTodo
 * @param {function} getDOMNode
 */
const onClickButton = (e, {addTodo, getDOMNode}) => {
  const input = getInput(getDOMNode);
  const value = input.value;

  if (value) {
    addTodo(value);
    resetInput(input);
  }
};

/**
 * on keydown, if enter is pressed then save the todo
 *
 * @param {Event} e
 * @param {function} addTodo
 */
const onKeyDownInput = (e, {addTodo}) => {
  const value = e.currentTarget.value;

  if (e.which === 13 && value) {
    addTodo(value);
    resetInput(e.currentTarget);
  }
};

const OPTIONS = {
  mapStateToProps,
  mapDispatchToProps,
  componentDidMount,
  componentWillUnmount,
  onClickButton,
  onKeyDownInput
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
  addTodo: PropTypes.func.isRequired,
  getDOMNode: PropTypes.func.isRequired,
  onClickButton: PropTypes.func.isRequired,
  onKeyDownInput: PropTypes.func.isRequired,
  recentlyAdded: PropTypes.string
};

export default createComponent(Add, OPTIONS);

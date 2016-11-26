import createComponent, {
  PropTypes
} from '../../src';

// actions
import * as actions from '../modules/app';

// styles
import selectors from '../css/components/Todo.css';

/**
 * get the target's ID from its data-id attribute
 *
 * @param {HTMLElement} target
 * @returns {string}
 */
const getId = (target) => {
  return target.getAttribute('data-id');
};

const mapDispatchToProps = {
  ...actions
};

/**
 * on click of the remove button, delete the todo from the list
 *
 * @param {Event} e
 * @param {function} deleteTodo
 */
const onClickRemoveButton = (e, {deleteTodo}) => {
  const id = getId(e.currentTarget);

  deleteTodo(id);
};

/**
 * on click of the toggle done button, toggle the isDone state of the todo
 *
 * @param {Event} e
 * @param {function} toggleTodoDone
 */
const onClickToggleDone = (e, {toggleTodoDone}) => {
  const id = getId(e.currentTarget);

  toggleTodoDone(id);
};

const OPTIONS = {
  mapDispatchToProps,
  onClickRemoveButton,
  onClickToggleDone
};

const Todo = ({id, isDone, onClickRemoveButton, onClickToggleDone, value}) => {
  let itemClassName = `${selectors.item}`;

  if (isDone) {
    itemClassName += ` ${selectors.done}`;
  }

  return (
    <li className={selectors.li}>
      <div className={selectors.container}>
        <div className={itemClassName}>
          {value}
        </div>

        <button
          className={selectors.action}
          data-id={id}
          onClick={onClickToggleDone}
          type="button"
        >
          Mark as {isDone ? 'incomplete' : 'complete'}
        </button>

        <button
          className={selectors.action}
          data-id={id}
          onClick={onClickRemoveButton}
          type="button"
        >
          Remove
        </button>
      </div>
    </li>
  );
};

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired
};

export default createComponent(Todo, OPTIONS);

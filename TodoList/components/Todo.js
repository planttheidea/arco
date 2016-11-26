import createComponent, {
  PropTypes
} from '../../src';

import * as actions from '../modules/app';

import jile from 'react-jile';

const STYLES = {
  '.li': {
    display: 'block',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  '.container': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  '.item': {
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 0,

    '&.done': {
      textDecoration: 'line-through'
    }
  },
  '.action': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    textDecoration: 'none',

    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline'
    }
  }
};

const getId = (target) => {
  return target.getAttribute('data-id');
};

const mapDispatchToProps = {
  ...actions
};

const onClickRemoveButton = (e, {deleteTodo}) => {
  const id = getId(e.currentTarget);

  deleteTodo(id);
};

const onClickToggleDone = (e, {toggleTodoDone}) => {
  const id = getId(e.currentTarget);

  toggleTodoDone(id);
};

const OPTIONS = {
  mapDispatchToProps,
  onClickRemoveButton,
  onClickToggleDone
};

const Todo = ({id, isDone, onClickRemoveButton, onClickToggleDone, selectors, value}) => {
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
  selectors: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export default jile(STYLES)(createComponent(Todo, OPTIONS));

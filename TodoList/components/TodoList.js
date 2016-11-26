import createComponent, {
  PropTypes
} from '../../src';

import jile from 'react-jile';

// components
import Todo from './Todo';

const STYLES = {
  '.ul': {
    listStyle: 'none',
    margin: 0,
    padding: 0
  }
};

const TodoList = ({selectors, todos}) => {
  return (
    <ul className={selectors.ul}>
      {todos.map((todo) => {
        return (
          <Todo
            key={todo.id}
            {...todo}
          />
        );
      })}
    </ul>
  );
};

TodoList.propTypes = {
  selectors: PropTypes.object.isRequired,
  todos: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default jile(STYLES)(createComponent(TodoList));

import createComponent, {
  PropTypes
} from '../../src';

// styles
import selectors from '../css/components/TodoList.css';

// components
import Todo from './Todo';

// shapes
import {
  todoShape
} from '../shapes/todos';

const TodoList = ({todos}) => {
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
  todos: PropTypes.arrayOf(todoShape).isRequired
};

export default createComponent(TodoList);

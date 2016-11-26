import createComponent, {
  PropTypes
} from '../../src';

// styles
import selectors from '../css/components/TodoList.css';

// components
import Todo from './Todo';

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
  todos: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default createComponent(TodoList);

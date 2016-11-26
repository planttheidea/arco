import createComponent, {
  Link,
  locationShape,
  PropTypes
} from '../../src';

import jile from 'react-jile';

// components
import TodoList from '../components/TodoList';

// selectors
import {
  getFilterFromPath,
  getFilteredTodos
} from '../selectors/todos';

// actions
import * as actions from '../modules/app';

const STYLES = {
  '.h1': {
    textAlign: 'center'
  },
  '.ul': {
    display: 'block',
    fontSize: 10,
    listStyle: 'none',
    textAlign: 'right'
  },
  '.li': {
    display: 'inline-block',
    listStyle: 'none',
    padding: 4
  },
  '.addTodoContainer': {
    padding: '15px 0',
    textAlign: 'right'
  },
  '.addTodo': {
    backgroundColor: '#fff',
    borderRadius: 4,
    boxShadow: '0 0 5px #7a7a7a',
    color: 'inherit!important',
    fontSize: 12,
    display: 'inline-block',
    padding: '4px 8px',
    textDecoration: 'none!important',

    '&:hover': {
      backgroundColor: '#f0f0f0'
    }
  }
};

const mapStateToProps = ({app}) => {
  const filteredTodos = getFilteredTodos(app);

  return {
    ...app,
    filteredTodos
  };
};

const mapDispatchToProps = {
  ...actions
};

const componentDidMount = ({location, filter, setFilter}) => {
  const pathname = location.pathname;
  const expectedFilter = getFilterFromPath({
    pathname
  });

  if (expectedFilter !== filter) {
    setFilter(pathname);
  }
};

const componentDidUpdate = ({location, setFilter}, {location: previousLocation}) => {
  if (location.pathname !== previousLocation.pathname) {
    setFilter(location.pathname);
  }
};

const OPTIONS = {
  mapStateToProps,
  mapDispatchToProps,
  componentDidMount,
  componentDidUpdate
};

const Todos = ({filteredTodos, selectors}) => {
  return (
    <section>
      <h1 className={selectors.h1}>
        Todo List
      </h1>

      <ul className={selectors.ul}>
        <li className={selectors.li}>
          <Link to="/">
            All
          </Link>
        </li>

        <li className={selectors.li}>
          <Link to="/complete">
            Complete
          </Link>
        </li>

        <li className={selectors.li}>
          <Link to="/incomplete">
            Incomplete
          </Link>
        </li>
      </ul>

      <TodoList todos={filteredTodos}/>

      <div className={selectors.addTodoContainer}>
        <Link
          className={selectors.addTodo}
          to="/add"
        >
          Add a todo!
        </Link>
      </div>
    </section>
  );
};

Todos.propTypes = {
  location: locationShape,
  selectors: PropTypes.object.isRequired,
  todos: PropTypes.arrayOf(PropTypes.object)
};

export default jile(STYLES)(createComponent(Todos, OPTIONS));

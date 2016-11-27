import createComponent, {
  Link,
  locationShape,
  PropTypes
} from '../../src';

// components
import TodoList from '../components/TodoList';

// selectors
import {
  getFilterFromPath,
  getFilteredTodos
} from '../selectors/todos';

// actions
import * as actions from '../modules/app/appActions';

// styles
import selectors from '../css/pages/Todos.css';

// shapes
import {
  todoShape
} from '../shapes/todos';

/**
 * map the app state to props, with the additional filteredTodos value
 *
 * @param {Object} app
 * @returns {Object}
 */
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

/**
 * on mount, if the filter does not match the one in state then update it
 *
 * @param {{pathname: string}} location
 * @param {string} filter
 * @param {function} setFilter
 */
const componentDidMount = ({location, filter, setFilter}) => {
  const pathname = location.pathname;
  const expectedFilter = getFilterFromPath({
    pathname
  });

  if (expectedFilter !== filter) {
    setFilter(pathname);
  }
};

/**
 * on update, set the filter if the location has changed
 *
 * @param {{pathname: string}} location
 * @param {function} setFilter
 * @param {{pathname: string}} previousLocation
 */
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

const Todos = ({filteredTodos}) => {
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
  filter: PropTypes.string,
  filteredTodos: PropTypes.arrayOf(todoShape).isRequired,
  location: locationShape.isRequired,
  setFilter: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(todoShape).isRequired
};

export default createComponent(Todos, OPTIONS);

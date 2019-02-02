import uuid from 'uuid/v4';

// selectors
import {getFilterFromPath} from '../../selectors/todos';

// module
import module, {
  addTodo,
  clearRecentlyAdded,
  deleteTodo,
  setFilter,
  toggleTodoDone,
} from './appActions';

const INITIAL_STATE = {
  filter: null,
  recentlyAdded: null,
  todos: [],
};

/**
 * add a todo to the list of todos
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
const addTodoHandler = (state, {payload}) => {
  const todoObject = {
    id: uuid(),
    isDone: false,
    value: payload,
  };
  const todos = [...state.todos, todoObject];

  return {
    ...state,
    recentlyAdded: payload,
    todos,
  };
};

/**
 * clear the recently added text
 *
 * @param {Object} state
 * @returns {{recentlyAdded: null}}
 */
const clearRecentlyAddedHandler = (state) => ({
  ...state,
  recentlyAdded: null,
});

/**
 * remove a todo from the list of todos
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
const deleteTodoHandler = (state, {payload}) => {
  const todoIndex = state.todos.findIndex(({id}) => id === payload);

  const todos = [...state.todos.slice(0, todoIndex), ...state.todos.slice(todoIndex + 1)];

  return {
    ...state,
    todos,
  };
};

/**
 * set the todos filter based on the pathname passed
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {string}
 */
const setFilterHandler = (state, {payload}) => {
  const filter = getFilterFromPath({
    pathname: payload,
  });

  return {
    ...state,
    filter,
  };
};

/**
 * toggle whether a todo is complete or not
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
const toggleTodoDoneHandler = (state, {payload}) => {
  const todoIndex = state.todos.findIndex(({id}) => id === payload);
  const todo = state.todos[todoIndex];

  const todos = [
    ...state.todos.slice(0, todoIndex),
    {
      ...todo,
      isDone: !todo.isDone,
    },
    ...state.todos.slice(todoIndex + 1),
  ];

  return {
    ...state,
    todos,
  };
};

export default module.createReducer(INITIAL_STATE, {
  [addTodo]: addTodoHandler,
  [clearRecentlyAdded]: clearRecentlyAddedHandler,
  [deleteTodo]: deleteTodoHandler,
  [setFilter]: setFilterHandler,
  [toggleTodoDone]: toggleTodoDoneHandler,
});

import uuid from 'node-uuid';

import {
  createModule
} from '../../src';

// selectors
import {
  getFilterFromPath
} from '../selectors/todos';

const ADD_TODO = 'ADD_TODO';
const CLEAR_RECENTLY_ADDED = 'CLEAR_RECENTLY_ADDED';
const DELETE_TODO = 'DELETE_TODO';
const SET_FILTER = 'SET_FILTER';
const TOGGLE_TODO_DONE = 'TOGGLE_TODO_DONE';

const module = createModule('app');

export const addTodo = module.createAction(ADD_TODO);
export const clearRecentlyAdded = module.createAction(CLEAR_RECENTLY_ADDED);
export const deleteTodo = module.createAction(DELETE_TODO);
export const setFilter = module.createAction(SET_FILTER);
export const toggleTodoDone = module.createAction(TOGGLE_TODO_DONE);

/**
 * add a todo to the list of todos
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
const addTodoHandler = (state, {payload}) => {
  const todoObject = {
    id: uuid.v4(),
    isDone: false,
    value: payload
  };
  const todos = [
    ...state.todos,
    todoObject
  ];
  
  return {
    ...state,
    recentlyAdded: payload,
    todos
  };
};

/**
 * clear the recently added text
 *
 * @param {Object} state
 * @returns {{recentlyAdded: null}}
 */
const clearRecentlyAddedHandler = (state) => {
  return {
    ...state,
    recentlyAdded: null
  };
};

/**
 * remove a todo from the list of todos
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
const deleteTodoHandler = (state, {payload}) => {
  const todoIndex = state.todos.findIndex(({id}) => {
    return id === payload;
  });
  
  const todos = [
    ...state.todos.slice(0, todoIndex),
    ...state.todos.slice(todoIndex + 1)
  ];
  
  return {
    ...state,
    todos
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
    pathname: payload
  });

  return {
    ...state,
    filter
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
  const todoIndex = state.todos.findIndex(({id}) => {
    return id === payload;
  });
  const todo = state.todos[todoIndex];

  const todos = [
    ...state.todos.slice(0, todoIndex),
    {
      ...todo,
      isDone: !todo.isDone
    },
    ...state.todos.slice(todoIndex + 1)
  ];

  return {
    ...state,
    todos
  };
};

const INITIAL_STATE = {
  filter: null,
  recentlyAdded: null,
  todos: []
};

module.createReducer(INITIAL_STATE, {
  [addTodo]: addTodoHandler,
  [clearRecentlyAdded]: clearRecentlyAddedHandler,
  [deleteTodo]: deleteTodoHandler,
  [setFilter]: setFilterHandler,
  [toggleTodoDone]: toggleTodoDoneHandler
});

export default module;

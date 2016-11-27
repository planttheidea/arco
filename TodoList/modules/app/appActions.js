import {
  createModule
} from '../../../src';

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

export default module;

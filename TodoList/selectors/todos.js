import {
  createSelector
} from '../../src';

// constants
import {
  ALL_TODOS,
  COMPLETE_TODOS,
  INCOMPLETE_TODOS
} from '../constants/filters';
import {
  COMPLETE_TODOS_ROUTE,
  INCOMPLETE_TODOS_ROUTE
} from '../constants/routes';

const getFilterFromPath = createSelector(['pathname'], (pathname) => {
  switch (pathname) {
    case COMPLETE_TODOS_ROUTE.to:
      return COMPLETE_TODOS;

    case INCOMPLETE_TODOS_ROUTE.to:
      return INCOMPLETE_TODOS;

    default:
      return ALL_TODOS;
  }
});

const getFilteredTodos = createSelector(['filter', 'todos'], (filter, todos) => {
  switch (filter) {
    case COMPLETE_TODOS:
      return todos.filter(({isDone}) => {
        return isDone;
      });

    case INCOMPLETE_TODOS:
      return todos.filter(({isDone}) => {
        return !isDone;
      });

    default:
      return todos;
  }
});

export {getFilterFromPath};
export {getFilteredTodos};

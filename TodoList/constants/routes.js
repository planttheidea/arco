// pages
import AddTodo from '../pages/AddTodo';
import Todos from '../pages/Todos';

const ALL_TODOS_ROUTE = {
  component: Todos,
  isIndex: true,
  isNav: true,
  title: 'Todos',
  to: '/'
};

const COMPLETE_TODOS_ROUTE = {
  component: Todos,
  title: 'Complete Todos',
  to: '/complete'
};

const INCOMPLETE_TODOS_ROUTE = {
  component: Todos,
  title: 'Incomplete Todos',
  to: '/incomplete'
};

const ADD_TODO_ROUTE = {
  component: AddTodo,
  title: 'Add Todo',
  isNav: true,
  to: '/add'
};

const ROUTES = [
  ALL_TODOS_ROUTE,
  ADD_TODO_ROUTE,
  COMPLETE_TODOS_ROUTE,
  INCOMPLETE_TODOS_ROUTE
];
const NAV_ROUTES = ROUTES.filter(({isNav}) => {
  return isNav;
});

export {ALL_TODOS_ROUTE};
export {COMPLETE_TODOS_ROUTE};
export {INCOMPLETE_TODOS_ROUTE};

export {NAV_ROUTES};
export {ROUTES};

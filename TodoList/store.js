import {
  createStore
} from '../src';

import appReducer from './modules/app/appReducer';
import history from './history';

const reducers = [
  appReducer
];

export default createStore(reducers, {
  history,
  shouldRestoreState: true
});

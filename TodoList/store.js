import {
  createStore
} from '../src';

import appModule from './modules/app';
import history from './history';

const modules = [
  appModule
];

export default createStore(modules, {
  history,
  shouldRestoreState: true
});

import {
  PropTypes
} from '../../src';

const todoShape = PropTypes.shape({
  id: PropTypes.string,
  isDone: PropTypes.bool,
  value: PropTypes.string
});

export {todoShape};

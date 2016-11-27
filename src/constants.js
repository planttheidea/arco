export const keys = Object.keys;

export const REACT_LIFECYCLE_METHODS = {
  componentWillMount: 1,
  componentDidMount: 2,
  componentWillReceiveProps: 3,
  shouldComponentUpdate: 4,
  componentWillUpdate: 5,
  componentDidUpdate: 6,
  componentWillUnmount: 7
};

export const REACT_ELEMENT_TYPE = (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) || 0xeac7;

export const ARCO_STATE_KEY = '@@arco-state';

export const STATUS = {
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS'
};

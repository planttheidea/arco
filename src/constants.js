const keys = Object.keys;

const REACT_LIFECYCLE_METHODS = {
  componentWillMount: 1,
  componentDidMount: 2,
  componentWillReceiveProps: 3,
  shouldComponentUpdate: 4,
  componentWillUpdate: 5,
  componentDidUpdate: 6,
  componentWillUnmount: 7
};

const REACT_ELEMENT_TYPE = (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) || 0xeac7;

const ARCO_STATE_KEY = '@@arco-state';

export {keys};

export {REACT_ELEMENT_TYPE};
export {REACT_LIFECYCLE_METHODS};
export {ARCO_STATE_KEY};

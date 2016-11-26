import createComponent, {
  PropTypes
} from '../src/index';

import jile from 'react-jile';

import Navigation from './components/Navigation';

const CONTENT_WIDTH = 500;

const STYLES = {
  '*, *:before, *:after': {
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontWeight: 300,
    position: 'relative'
  },
  'html, body': {
    margin: 0,
    padding: 0
  },
  'body': {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#5d5d5d'
  },
  'h1, h2, h3, h4, h5, h6': {
    margin: '1em 0 0.5em'
  },
  input: {
    border: 0,
    borderRadius: 4,
    boxShadow: 'inset 0 0 4px #7a7a7a',
    outline: 'none',
    padding: 4,

    '&:focus': {
      boxShadow: 'inset 0 0 2px #004B85, 0 0 4px #004B85'
    }
  },
  button: {
    appearance: 'none',
    backgroundColor: '#fff',
    border: 0,
    borderRadius: 4,
    boxShadow: '0 0 5px #7a7a7a',
    cursor: 'pointer',
    fontSize: 12,
    outline: 'none',
    padding: '4px 8px',

    '&:hover': {
      backgroundColor: '#f0f0f0'
    }
  },
  '.container': {
    backgroundColor: '#D1D7DB',
    height: '100vh',
    overflow: 'auto',
    width: '100vw',

    '&:before, &:after': {
      content: '""',
      display: 'table'
    },
    '&:after': {
      clear: 'both'
    }
  },
  '.content': {
    margin: '0 auto',
    width: CONTENT_WIDTH
  }
};

const App = ({children, selectors}) => {
  return (
    <div className={selectors.container}>
      <Navigation width={CONTENT_WIDTH}/>

      <main className={selectors.content}>
        {children}
      </main>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node,
  selectors: PropTypes.object
};

export default jile(STYLES)(createComponent(App));

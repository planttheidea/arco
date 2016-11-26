// external dependencies
import createComponent, {
  Link,
  PropTypes
} from '../../src';
import jile from 'react-jile';

// constants
import {
  NAV_ROUTES
} from '../constants/routes';

const STYLES = {
  '.nav': {
    backgroundColor: '#fff',
    boxShadow: '0 0 5px #121517',
    width: '100%'
  },
  '.navItem': {
    color: 'inherit',
    flexBasis: '50%',
    flexGrow: 0,
    flexShrink: 0,
    padding: 15,
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out',
    width: '50%',

    '&:hover': {
      backgroundColor: '#3b444b',
      color: '#fff'
    }
  },
  '.navItemsContainer': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    margin: '0 auto'
  }
};

const Navigation = ({selectors, width = '100%'}) => {
  const containerStyles = {
    width
  };

  return (
    <nav className={selectors.nav}>
      <div
        className={selectors.navItemsContainer}
        style={containerStyles}
      >
        {NAV_ROUTES.map(({title, to}, routeIndex) => {
          return (
            <Link
              className={selectors.navItem}
              key={`nav-item-${routeIndex}`}
              to={to}
            >
              {title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  selectors: PropTypes.object,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default jile(STYLES)(createComponent(Navigation));

// external dependencies
import createComponent, {
  Link,
  PropTypes
} from '../../src';

// styles
import selectors from '../css/components/Navigation.css';

// constants
import {
  NAV_ROUTES
} from '../constants/routes';

const Navigation = ({width = '100%'}) => {
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
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default createComponent(Navigation);

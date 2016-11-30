// external dependencies
import createComponent, {
  Component,
  Link,
  PropTypes
} from '../../src';

// styles
import selectors from '../css/components/Navigation.css';

// constants
import {
  NAV_ROUTES
} from '../constants/routes';

// the use of this class is not necessary, just used for example purposes
class Navigation extends Component {
  static propTypes = {
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  };

  render({width = '100%'}) {
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
  }
}

export default createComponent(Navigation);

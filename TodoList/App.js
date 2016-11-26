import createComponent, {
  PropTypes
} from '../src/index';

// components
import Navigation from './components/Navigation';

// style
import 'normalize.css';
import selectors from './css/App.css';

const App = ({children}) => {
  return (
    <div className={selectors.container}>
      <Navigation width={500}/>

      <main className={selectors.content}>
        {children}
      </main>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node
};

export default createComponent(App);

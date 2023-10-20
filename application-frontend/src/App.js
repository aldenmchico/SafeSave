import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css'; 

// Lazy-loaded components
const Navigation = lazy(() => import('./Navigation'));
const HomePage = lazy(() => import('./HomePage'));
const FavoritesPage = lazy(() => import('./FavoritesPage'));
const LoginsPage = lazy(() => import('./LoginsPage'));
const NotesPage = lazy(() => import('./NotesPage'));
const PaymentsPage = lazy(() => import('./PaymentsPage'));
const PersonalInfoPage = lazy(() => import('./PersonalInfoPage'));
const IDsPage = lazy(() => import('./IDsPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));
const AboutPage = lazy(() => import('./AboutPage'));

// Authentication context
const AuthContext = createContext();

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Placeholder
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) setIsAuthenticated(true);
  }, []);

  const login = () => setIsAuthenticated(true); // Update later 
  const logout = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
  }; // Update later

  return { isAuthenticated, login, logout };
}

// Protected route
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh or contact support.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
              <Navigation />
              <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/about" component={AboutPage} />
                {/* Protected routes, add more later */}
                <ProtectedRoute path="/favorites" component={FavoritesPage} />
                <ProtectedRoute path="/logins" component={LoginsPage} />
                <Route component={() => <div>404 Not found</div>} />
              </Switch>
            </Suspense>
          </div>
        </Router>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}

export default App;

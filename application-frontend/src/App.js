import React, { createContext, useState, useEffect, useContext, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Import other components


// Lazy-loaded components
const Navigation = lazy(() => import('./components/Navigation'));
const HomePage = lazy(() => import('./pages/HomePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const LoginsPage = lazy(() => import('./pages/LoginPage'));
const NotesPage = lazy(() => import('./pages/SavedNotesPage'));
const PaymentsPage = lazy(() => import('./pages/PaymentsPage'));
const PersonalInfoPage = lazy(() => import('./pages/PersonalInfoPage'));
const IDsPage = lazy(() => import('./pages/IDsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFound = lazy(() => import('./pages/NotFound')); // Make sure you have a NotFound component


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
  const navigate = useNavigate(); // New navigation hook
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/'); // Navigate to home if not authenticated
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Route {...rest} element={<Component />} /> : null; // Adjusted for v6
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
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/logins" element={<LoginsPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/personalinfo" element={<PersonalInfoPage />} />
                <Route path="/ids" element={<IDsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* Add a catch-all route for 404 Not Found pages */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <footer className="App-footer">
              © {new Date().getFullYear()} SafeSave. All rights reserved.
            </footer>
          </div>
        </Router>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}

export default App;

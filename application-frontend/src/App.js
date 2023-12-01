import React, { createContext, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Lazy-loaded components
const Navigation = lazy(() => import('./components/Navigation'));
const HomePage = lazy(() => import('./pages/HomePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const TwoFactorAuthenticationPage = lazy(() => import('./pages/TwoFactorAuthenticationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SavedLoginsPage = lazy(() => import('./pages/SavedLoginsPage'));
const NotesPage = lazy(() => import('./pages/SavedNotesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CreateAccountPage = lazy(() => import('./pages/CreateAccountPage'));
const CreateSavedLoginPage = lazy(() => import('./pages/CreateSavedLoginPage'));
const CreateSavedNotePage = lazy(() => import('./pages/CreateSavedNotePage'));
const EditSavedLoginPage = lazy(() => import('./pages/EditSavedLoginPage'));
const EditSavedNotePage = lazy(() => import('./pages/EditSavedNotePage'));
const NotFound = lazy(() => import('./pages/NotFound'));  // 404 page

// Authentication context
export const AuthContext = createContext();

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) setIsAuthenticated(true);
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}

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
  const [loginItem, setLoginItem] = useState([]);
  const [note, setNote] = useState([]);

  return (
    <AuthContext.Provider value={auth}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
              <Navigation />
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage setLoginItem={setLoginItem} />} />
                <Route path="/favorites" element={<FavoritesPage setLoginItem={setLoginItem} setNote={setNote} />} />
                <Route path="/twofactorauth" element={<TwoFactorAuthenticationPage />} />

                <Route path="/savedlogins" element={<SavedLoginsPage setLoginItem={setLoginItem} />} />
                <Route path="/savednotes" element={<NotesPage setNote={setNote} />} />
                {/*<Route path="/payments" element={<PaymentsPage />} />*/}
                {/*<Route path="/personalinfo" element={<PersonalInfoPage />} />*/}
                {/*<Route path="/ids" element={<IDsPage />} />*/}
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/createaccount" element={<CreateAccountPage />} />
                <Route path="/edit-login" element={<EditSavedLoginPage loginItem={loginItem} />} />
                <Route path="/edit-note" element={<EditSavedNotePage note={note} />} />
                <Route path="/createsavedlogin" element={<CreateSavedLoginPage />} />
                <Route path="/createsavednote" element={<CreateSavedNotePage />} />
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
